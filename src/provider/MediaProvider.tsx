import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

interface MediaDevice {
  value: MediaDeviceInfo;
  label: string;
}

interface MediaStreamContextProps {
  videoStream: MediaStream | null;
  audioStream: MediaStream | null;
  screenStream: MediaStream | null;
  getVideoStream: (deviceId?: string) => Promise<MediaStream | null>;
  getAudioStream: (deviceId?: string) => Promise<MediaStream | null>;
  getScreenStream: (deviceId?: string) => Promise<MediaStream | null>;
  stopVideoStream: (deviceId?: string) => void;
  stopAudioStream: (deviceId?: string) => void;
  stopScreenStream: (deviceId?: string) => void;
  microphones: MediaDevice[];
  speakers: MediaDevice[];
  cameras: MediaDevice[];
  screens: MediaDevice[];
}

const MediaStreamContext = createContext<MediaStreamContextProps | undefined>(
  undefined
);

export const useMediaStream = (): MediaStreamContextProps => {
  const context = useContext(MediaStreamContext);
  if (!context) {
    throw new Error("useMediaStream must be used within a MediaStreamProvider");
  }
  return context;
};

export const MediaStreamProvider = ({ children }: { children: ReactNode }) => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const [microphones, setMicrophones] = useState<MediaDevice[]>([]);
  const [speakers, setSpeakers] = useState<MediaDevice[]>([]);
  const [cameras, setCameras] = useState<MediaDevice[]>([]);
  const [screens, setScreens] = useState<MediaDevice[]>([]);

  const getVideoStream = useCallback(async (deviceId?: string) => {
    try {
      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setVideoStream(stream);

      return stream;
    } catch (error) {
      console.error("Error accessing video stream:", error);
      return null;
    }
  }, []);

  const getAudioStream = useCallback(async (deviceId?: string) => {
    try {
      const constraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setAudioStream(stream);

      return stream;
    } catch (error) {
      console.error("Error accessing audio stream:", error);
      return null;
    }
  }, []);

  const getScreenStream = useCallback(async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });
      setScreenStream(stream);

      return stream;
    } catch (error) {
      console.error("Error accessing screen stream:", error);
      return null;
    }
  }, []);

  const stopStream = useCallback(
    (
      setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>,
      stream: MediaStream | null,
      deviceId?: string
    ) => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          if (!deviceId || track.getSettings().deviceId === deviceId) {
            track.stop();
          }
        });
        setStream(null);
      }
    },
    []
  );

  const stopVideoStream = useCallback(
    (deviceId?: string) => stopStream(setVideoStream, videoStream, deviceId),
    [stopStream, videoStream]
  );
  const stopAudioStream = useCallback(
    (deviceId?: string) => stopStream(setAudioStream, audioStream, deviceId),
    [stopStream, audioStream]
  );
  const stopScreenStream = useCallback(
    (deviceId?: string) => stopStream(setScreenStream, screenStream, deviceId),
    [stopStream, screenStream]
  );

  const updateDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const microphones = devices
      .filter((device) => device.kind === "audioinput")
      .map((device) => ({ value: device, label: device.label }));
    setMicrophones(microphones);

    const speakers = devices
      .filter((device) => device.kind === "audiooutput")
      .map((device) => ({ value: device, label: device.label }));
    setSpeakers(speakers);

    const cameras = devices
      .filter((device) => device.kind === "videoinput")
      .map((device) => ({ value: device, label: device.label }));
    setCameras(cameras);

    // Screens are not part of enumerateDevices, so we handle them separately
    setScreens([]);
  }, []);

  useEffect(() => {
    updateDevices();
    navigator.mediaDevices.addEventListener("devicechange", updateDevices);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", updateDevices);
    };
  }, [updateDevices]);

  const value = {
    videoStream,
    audioStream,
    screenStream,
    getVideoStream,
    getAudioStream,
    getScreenStream,
    stopVideoStream,
    stopAudioStream,
    stopScreenStream,
    microphones,
    speakers,
    cameras,
    screens,
  };

  return (
    <MediaStreamContext.Provider value={value}>
      {children}
    </MediaStreamContext.Provider>
  );
};
