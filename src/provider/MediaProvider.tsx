import React, {
  createContext,
  useRef,
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
  getVideoStream: () => Promise<void>;
  getAudioStream: () => Promise<void>;
  getScreenStream: () => Promise<void>;
  stopVideoStream: () => void;
  stopAudioStream: () => void;
  stopScreenStream: () => void;
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
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [microphones, setMicrophones] = useState<MediaDevice[]>([]);
  const [speakers, setSpeakers] = useState<MediaDevice[]>([]);
  const [cameras, setCameras] = useState<MediaDevice[]>([]);
  const [screens, setScreens] = useState<MediaDevice[]>([]);

  const getVideoStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStreamRef.current = stream;
    } catch (error) {
      console.error("Error accessing video stream:", error);
    }
  }, []);

  const getAudioStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
    } catch (error) {
      console.error("Error accessing audio stream:", error);
    }
  }, []);

  const getScreenStream = useCallback(async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });
      screenStreamRef.current = stream;
    } catch (error) {
      console.error("Error accessing screen stream:", error);
    }
  }, []);

  const stopStream = useCallback(
    (streamRef: React.MutableRefObject<MediaStream | null>) => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    },
    []
  );

  const stopVideoStream = useCallback(
    () => stopStream(videoStreamRef),
    [stopStream]
  );
  const stopAudioStream = useCallback(
    () => stopStream(audioStreamRef),
    [stopStream]
  );
  const stopScreenStream = useCallback(
    () => stopStream(screenStreamRef),
    [stopStream]
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
    videoStream: videoStreamRef.current,
    audioStream: audioStreamRef.current,
    screenStream: screenStreamRef.current,
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
