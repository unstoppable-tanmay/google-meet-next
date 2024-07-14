import { MeetType, PeerDetailsType, UserSocketType } from "@/types/types";
import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer, ProducerOptions } from "mediasoup-client/lib/Producer";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/Transport";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SetterOrUpdater } from "recoil";
import { io, Socket } from "socket.io-client";
import { audio_params, video_params } from "../lib/constants";
import { useMediaStream } from "./MediaProvider";

interface DataContextProps {
  device: React.MutableRefObject<Device | null>;
  producerTransport: React.MutableRefObject<Transport | null>;
  consumingTransports: React.MutableRefObject<string[]>;
  consumerTransports: React.MutableRefObject<
    {
      consumerTransport: Transport;
      serverConsumerTransportId: string;
      producerId: string;
      consumer: Consumer;
      socketId: string;
      serverConsumerId: string;
    }[]
  >;
  joinRoom: (
    socket: Socket,
    roomId: string,
    setTracks: SetterOrUpdater<UserSocketType[]>,
    peerDetails: PeerDetailsType,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMeetDetails: SetterOrUpdater<MeetType | null>
  ) => void;
  connectSendTransport: (
    track: MediaStreamTrack,
    type: "video" | "audio" | "screen",
    socketId: string,
    params: ProducerOptions
  ) => Promise<void>;
  VideoManager: (
    setting: boolean,
    socket: Socket,
    connectSendTransport: any
  ) => Promise<void>;
  AudioManager: (
    setting: boolean,
    socket: Socket,
    connectSendTransport: any
  ) => Promise<void>;
  ScreenManager: (
    setting: boolean,
    socket: Socket,
    connectSendTransport: any
  ) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const videoProducer = useRef<Producer<{
    socketId: string;
    type: "video" | "audio" | "screen";
  }> | null>(null);
  const audioProducer = useRef<Producer<{
    socketId: string;
    type: "video" | "audio" | "screen";
  }> | null>(null);
  const screenProducer = useRef<Producer<{
    socketId: string;
    type: "video" | "audio" | "screen";
  }> | null>(null);

  const device = useRef<Device | null>(null);
  const producerTransport = useRef<Transport | null>(null);
  const consumingTransports = useRef<string[]>([]);
  const consumerTransports = useRef<
    {
      consumerTransport: Transport;
      serverConsumerTransportId: string;
      producerId: string;
      consumer: Consumer;
      socketId: string;
      serverConsumerId: string;
    }[]
  >([]);

  const {
    cameras,
    microphones,
    screens,
    speakers,
    getAudioStream,
    getScreenStream,
    getVideoStream,
    audioStream,
    screenStream,
    videoStream,
    stopAudioStream,
    stopScreenStream,
    stopVideoStream,
  } = useMediaStream();

  const joinRoom = (
    socket: Socket,
    roomId: string,
    setTracks: SetterOrUpdater<UserSocketType[]>,
    peerDetails: PeerDetailsType,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMeetDetails: SetterOrUpdater<MeetType | null>
  ) => {
    socket.emit(
      "joinRoom",
      { roomName: roomId, peerDetails },
      ({
        rtpCapabilities,
        meetDetails,
      }: {
        rtpCapabilities: RtpCapabilities;
        meetDetails: MeetType;
      }) => {
        setMeetDetails(meetDetails);
        console.log(meetDetails);
        setLoading(false);
        createDevice(socket, rtpCapabilities, setTracks);
      }
    );

    socket.on("new-producer", ({ producerId }) =>
      signalNewConsumerTransport(producerId, socket, setTracks)
    );

    socket.on("producer-closed", ({ remoteProducerId }) => {
      const producerToClose = consumerTransports.current.find(
        (transportData) => transportData.producerId === remoteProducerId
      );
      producerToClose!.consumerTransport.close();
      producerToClose!.consumer.close();

      consumerTransports.current = consumerTransports.current.filter(
        (transportData) => transportData.producerId !== remoteProducerId
      );
    });
  };

  const createDevice = async (
    socket: Socket,
    rtpCapabilities: RtpCapabilities,
    setTracks: SetterOrUpdater<UserSocketType[]>
  ) => {
    try {
      device.current = new Device();

      await device.current.load({
        routerRtpCapabilities: rtpCapabilities,
      });

      if (device.current.loaded) createSendTransport(socket, setTracks);
    } catch (error: any) {
      console.log(error);
      if (error.name === "UnsupportedError")
        console.warn("browser not supported");
    }
  };

  const createSendTransport = (
    socket: Socket,
    setTracks: SetterOrUpdater<UserSocketType[]>
  ) => {
    if (device.current!.loaded)
      socket.emit(
        "createWebRtcTransport",
        { consumer: false },
        async ({ params }: { params: any }) => {
          if (params.error) {
            console.log(params.error);
            return;
          }

          let locProducerTransport = device.current!.createSendTransport({
            ...params,
            appData: { socketId: socket.id },
          });

          locProducerTransport!.on(
            "connect",
            async ({ dtlsParameters }, callback, errback) => {
              try {
                socket.emit("transport-connect", {
                  dtlsParameters,
                });

                callback();
              } catch (error: any) {
                errback(error);
              }
            }
          );

          locProducerTransport!.on(
            "produce",
            async (parameters, callback, errback) => {
              try {
                socket.emit(
                  "transport-produce",
                  {
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData,
                  },
                  ({
                    id,
                    producersExist,
                  }: {
                    id: any;
                    producersExist: any;
                  }) => {
                    callback({ id });

                    if (producersExist) getProducers(socket, setTracks);
                  }
                );
              } catch (error: any) {
                errback(error);
              }
            }
          );
          getProducers(socket, setTracks);

          producerTransport.current = locProducerTransport;
        }
      );
  };

  const getProducers = (
    socket: Socket,
    setTracks: SetterOrUpdater<UserSocketType[]>
  ) => {
    socket.emit("getProducers", (producerIds: string[]) => {
      producerIds.forEach((e) =>
        signalNewConsumerTransport(e, socket, setTracks)
      );
    });
  };

  const signalNewConsumerTransport = async (
    remoteProducerId: string,
    socket: Socket,
    setTracks: SetterOrUpdater<UserSocketType[]>
  ) => {
    if (consumingTransports.current.includes(remoteProducerId)) return;
    consumingTransports.current.push(remoteProducerId);

    await socket.emit(
      "createWebRtcTransport",
      { consumer: true },
      ({ params }: { params: any }) => {
        if (params.error) {
          console.log(params.error);
          return;
        }

        let consumerTransport;
        try {
          consumerTransport = device.current!.createRecvTransport(params);
        } catch (error) {
          console.log(error);
          return;
        }

        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              socket.emit("transport-recv-connect", {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });

              callback();
            } catch (error: any) {
              errback(error);
            }
          }
        );

        connectRecvTransport(
          consumerTransport,
          remoteProducerId,
          params.id,
          socket,
          setTracks
        );
      }
    );
  };

  const connectRecvTransport = async (
    consumerTransport: Transport,
    remoteProducerId: string,
    serverConsumerTransportId: any,
    socket: Socket,
    setTracks: SetterOrUpdater<UserSocketType[]>
  ) => {
    socket.emit(
      "consume",
      {
        rtpCapabilities: device.current!.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }: { params: any }) => {
        if (params.error) {
          console.log("Cannot Consume");
          return;
        }

        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
          appData: params.appData,
        });

        const { track, appData } = consumer;

        consumerTransports.current = [
          ...consumerTransports.current,
          {
            socketId: appData.socketId,
            consumerTransport,
            serverConsumerTransportId: params.id,
            serverConsumerId: params.serverConsumerId,
            producerId: remoteProducerId,
            consumer,
          },
        ];

        setTracks((prev) => [
          ...prev,
          {
            name: "",
            socketId: appData.socketId,
            tracks: track,
            image: "",
            type: appData.type,
          },
        ]);

        socket.emit("consumer-resume", {
          serverConsumerId: params.serverConsumerId,
        });
      }
    );
  };

  const connectSendTransport = async (
    track: MediaStreamTrack,
    type: "video" | "audio" | "screen",
    socketId: string,
    params: ProducerOptions
  ) => {
    if (track) {
      let mediaParams: ProducerOptions = { ...params, track: track };

      let mediaProducer = await producerTransport.current!.produce({
        ...mediaParams,
        appData: { socketId, type },
      });

      mediaProducer.on("trackended", () => {
        console.log("video track ended");
      });

      mediaProducer.on("transportclose", () => {
        console.log("video transport ended");
        mediaProducer.close();
      });
    }
  };

  const VideoManager = async (
    setting: boolean,
    socket: Socket,
    connectSendTransport: any
  ) => {
    if (setting) {
      if (!videoProducer.current) {
        // videoStream.current = await window.navigator.mediaDevices.getUserMedia({
        //   video: {
        //     width: {
        //       min: 640,
        //       max: 1920,
        //     },
        //     height: {
        //       min: 400,
        //       max: 1080,
        //     },
        //     noiseSuppression: true,
        //   },
        // });

        const stream = await getVideoStream();

        connectSendTransport(
          stream?.getVideoTracks()[0],
          "video",
          socket.id!,
          video_params
        );
      } else {
        videoProducer.current.resume();
      }
    } else {
      videoProducer.current?.pause();
    }
  };
  const AudioManager = async (
    setting: boolean,
    socket: Socket,
    connectSendTransport: any
  ) => {
    if (setting) {
      if (!audioProducer.current) {
        const stream = await getAudioStream();
        connectSendTransport(
          stream?.getAudioTracks()[0],
          "audio",
          socket.id!,
          audio_params
        );
      } else {
        audioProducer.current.resume();
      }
    } else {
      audioProducer.current?.pause();
    }
  };
  const ScreenManager = async (
    setting: boolean,
    socket: Socket,
    connectSendTransport: any
  ) => {
    if (setting) {
      if (!screenProducer.current) {
        const stream = await getScreenStream();
        if (stream)
          connectSendTransport(
            stream.getVideoTracks()[0],
            "video",
            socket.id!,
            video_params
          );
      } else {
        screenProducer.current.resume();
      }
    } else {
      screenProducer.current?.pause();
    }
  };

  return (
    <DataContext.Provider
      value={{
        device,
        producerTransport,
        consumingTransports,
        consumerTransports,
        joinRoom,
        connectSendTransport,
        VideoManager,
        AudioManager,
        ScreenManager,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
