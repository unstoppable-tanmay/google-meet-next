import { MeetType, PeerDetailsType, UserSocketType } from "@/types/types";
import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { ProducerOptions } from "mediasoup-client/lib/Producer";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/Transport";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { SetterOrUpdater } from "recoil";
import { io, Socket } from "socket.io-client";

interface DataContextProps {
  device: React.MutableRefObject<Device | null>;
  producerTransport: React.MutableRefObject<Transport | null>;
  consumingTransports: React.MutableRefObject<string[]>;
  consumerTransports: React.MutableRefObject<{
    consumerTransport: Transport;
    serverConsumerTransportId: string;
    producerId: string;
    consumer: Consumer;
  }[]>;
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
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const device = useRef<Device | null>(null);
  const producerTransport = useRef<Transport | null>(null);
  const consumingTransports = useRef<string[]>([]);
  const consumerTransports = useRef<{
    consumerTransport: Transport;
    serverConsumerTransportId: string;
    producerId: string;
    consumer: Consumer;
  }[]>([]);

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
      ({ rtpCapabilities, meetDetails }: { rtpCapabilities: RtpCapabilities; meetDetails: MeetType }) => {
        setMeetDetails(meetDetails);
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
      if (error.name === "UnsupportedError") console.warn("browser not supported");
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
                  ({ id, producersExist }: { id: any; producersExist: any }) => {
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
      producerIds.forEach((e) => signalNewConsumerTransport(e, socket, setTracks));
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

        consumerTransports.current = [
          ...consumerTransports.current,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];

        const { track, appData } = consumer;

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

  return (
    <DataContext.Provider
      value={{
        device,
        producerTransport,
        consumingTransports,
        consumerTransports,
        joinRoom,
        connectSendTransport,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
