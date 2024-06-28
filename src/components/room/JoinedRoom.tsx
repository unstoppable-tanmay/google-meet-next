import React, { useEffect, useRef, useState } from "react";
import BottomBar from "./components/BottomBar";

import { joined } from "@/state/atom";
import { useRecoilState } from "recoil";
import { AnimatePresence, motion } from "framer-motion";
import { Socket, io } from "socket.io-client";
import { Device } from "mediasoup-client";
import {
  Consumer,
  Producer,
  ProducerOptions,
  RtpCapabilities,
  Transport,
} from "mediasoup-client/lib/types";
import { params } from "@/lib/constants";
import { BiSolidBuildings } from "react-icons/bi";
import VideoArea from "./components/VideoArea";
import { Spinner } from "@nextui-org/react";

let socket: Socket;
let device: Device;
let rtpCapabilities: RtpCapabilities;
let producerTransport: Transport;
let consumerTransports: {
  consumerTransport: Transport;
  serverConsumerTransportId: string;
  producerId: string;
  consumer: Consumer;
}[] = [];
let consumingTransports: string[];

const JoinedRoom = ({ roomId }: { roomId: string }) => {
  // whole session join
  const [join, setJoin] = useRecoilState(joined);
  const videoContainer = useRef<HTMLVideoElement>(null);
  const localvideoContainer = useRef<HTMLVideoElement>(null);

  const [tracks, setTracks] = useState<MediaStreamTrack>();

  // initial loading
  const [loading, setLoading] = useState(true);

  // Joining Logic
  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/mediasoup`, {
      transports: ["websocket"],
    });

    socket!.on("connection-success", ({ socketId }) => {
      console.log("joining");
      // joinRoom(socket,roomId);
      joinRoom();
    });

    socket!.on("new-producer", ({ producerId }) =>
      signalNewConsumerTransport(producerId, device)
    );

    socket!.on("producer-closed", ({ remoteProducerId }) => {
      // server notification is received when a producer is closed
      // we need to close the client-side consumer and associated transport
      const producerToClose = consumerTransports.find(
        (transportData) => transportData.producerId === remoteProducerId
      );
      producerToClose!.consumerTransport.close();
      producerToClose!.consumer.close();

      // remove the consumer transport from the list
      consumerTransports = consumerTransports.filter(
        (transportData) => transportData.producerId !== remoteProducerId
      );

      // remove the video div element
      // videoContainer.removeChild(document.getElementById(`td-${remoteProducerId}`))
    });

    return () => {
      socket.off();
      socket.close();
      producerTransport?.close()
    };
  }, []);

  const joinRoom = () => {
    socket!.emit("joinRoom", { roomName: roomId }, (data: any) => {
      rtpCapabilities = data.rtpCapabilities;
      console.log("creating device", data.rtpCapabilities);
      createDevice(data.rtpCapabilities);
    });
  };

  const createDevice = async (rtpCapabilities: RtpCapabilities) => {
    try {
      device = new Device();

      await device.load({
        routerRtpCapabilities: rtpCapabilities!,
      });

      createSendTransport();
    } catch (error: any) {
      console.log(error);
      if (error.name === "UnsupportedError")
        console.warn("browser not supported");
    }
  };

  const createSendTransport = () => {
    socket!.emit(
      "createWebRtcTransport",
      { consumer: false },
      async ({ params }: { params: any }) => {
        if (params.error) {
          console.log(params.error);
          return;
        }

        console.log(device);

        let locproducerTransport = device!.createSendTransport(params);

        locproducerTransport!.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              await socket!.emit("transport-connect", {
                dtlsParameters,
              });

              callback();
            } catch (error: any) {
              errback(error);
            }
          }
        );

        locproducerTransport!.on(
          "produce",
          async (parameters, callback, errback) => {
            console.log(parameters);

            try {
              await socket!.emit(
                "transport-produce",
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id, producersExist }: { id: any; producersExist: any }) => {
                  callback({ id });

                  if (producersExist) getProducers(device);
                }
              );
            } catch (error: any) {
              errback(error);
            }
          }
        );

        producerTransport = locproducerTransport;

        // console.log("getting the track");

        // const track = await window.navigator.mediaDevices
        //   .getUserMedia({
        //     audio: true,
        //     video: {
        //       width: {
        //         min: 640,
        //         max: 1920,
        //       },
        //       height: {
        //         min: 400,
        //         max: 1080,
        //       },
        //     },
        //   })
        //   .then((e) => e.getVideoTracks());

        // connectSendTransport(track[0], "video");
      }
    );
  };

  const getProducers = (device: Device) => {
    socket!.emit("getProducers", (producerIds: string[]) => {
      console.log(producerIds);
      // for each of the producer create a consumer
      // producerIds.forEach(id => signalNewConsumerTransport(id))
      producerIds.forEach((e) => signalNewConsumerTransport(e, device));
    });
  };

  const signalNewConsumerTransport = async (
    remoteProducerId: string,
    device: Device
  ) => {
    //check if we are already consuming the remoteProducerId
    if (consumingTransports.includes(remoteProducerId)) return;
    consumingTransports.push(remoteProducerId);

    await socket!.emit(
      "createWebRtcTransport",
      { consumer: true },
      ({ params }: { params: any }) => {
        // The server sends back params needed
        // to create Send Transport on the client side
        if (params.error) {
          console.log(params.error);
          return;
        }
        console.log(`PARAMS... ${params}`);

        let consumerTransport;
        try {
          console.log(device);
          consumerTransport = device!.createRecvTransport(params);
        } catch (error) {
          // exceptions:
          // {InvalidStateError} if not loaded
          // {TypeError} if wrong arguments.
          console.log(error);
          return;
        }

        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              // Signal local DTLS parameters to the server side transport
              // see server's socket.on('transport-recv-connect', ...)
              await socket!.emit("transport-recv-connect", {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });

              // Tell the transport that parameters were transmitted.
              callback();
            } catch (error: any) {
              // Tell the transport that something was wrong
              errback(error);
            }
          }
        );

        connectRecvTransport(
          consumerTransport,
          remoteProducerId,
          params.id,
          device
        );
      }
    );
  };

  const connectRecvTransport = async (
    consumerTransport: Transport,
    remoteProducerId: string,
    serverConsumerTransportId: any,
    device: Device
  ) => {
    // for consumer, we need to tell the server first
    // to create a consumer based on the rtpCapabilities and consume
    // if the router can consume, it will send back a set of params as below
    await socket!.emit(
      "consume",
      {
        rtpCapabilities: device!.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }: { params: any }) => {
        if (params.error) {
          console.log("Cannot Consume");
          return;
        }

        console.log(`Consumer Params ${params}`);
        // then consume with the local consumer transport
        // which creates a consumer
        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        consumerTransports = [
          ...consumerTransports,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];

        // create a new div element for the new consumer media
        const newElem = document.createElement("div");
        newElem.setAttribute("id", `td-${remoteProducerId}`);

        if (params.kind == "audio") {
          //append to the audio container
          newElem.innerHTML =
            '<audio controls id="' + remoteProducerId + '" autoplay></audio>';
        } else {
          //append to the video container
          newElem.setAttribute("class", "remoteVideo");
          newElem.innerHTML =
            '<video controls id="' +
            remoteProducerId +
            '" autoplay class="video" ></video>';
        }

        console.log("iahuashahushasjdakdhsn");

        console.log(newElem);

        // videoContainer.current?.appendChild(newElem);
        console.log("--------------------------");

        // destructure and retrieve the video track from the producer
        const { track } = consumer;

        console.log("Track: ", track);

        // (
        //   document.getElementById(remoteProducerId) as HTMLVideoElement
        // ).srcObject = new MediaStream([track]);

        console.log(videoContainer.current);

        // videoContainer.current!.srcObject = new MediaStream([track]);
        setTracks(track);

        // the server consumer started with media paused
        socket!.emit("consumer-resume", {
          serverConsumerId: params.serverConsumerId,
        });
      }
    );
  };

  const connectSendTransport = async (
    track: MediaStreamTrack,
    type: "video" | "audio" | "screen"
  ) => {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above

    console.log(track, type);

    let audioParams: ProducerOptions = { appData: { type: "" } };
    let videoParams: ProducerOptions = { ...params, track: track };

    // let audioProducer = await producerTransport!.produce(audioParams);
    let videoProducer = await producerTransport!.produce(videoParams);

    // audioProducer.on("trackended", () => {
    //   console.log("audio track ended");

    //   // close audio track
    // });

    // audioProducer.on("transportclose", () => {
    //   console.log("audio transport ended");

    //   // close audio track
    // });

    videoProducer.on("trackended", () => {
      console.log("video track ended");

      // close video track
    });

    videoProducer.on("transportclose", () => {
      console.log("video transport ended");

      // close video track
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (videoContainer.current) {
      videoContainer.current.srcObject = new MediaStream([tracks!]);
    }
    console.log(tracks);
  }, [tracks]);

  const sendVideo = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: {
          min: 640,
          max: 1920,
        },
        height: {
          min: 400,
          max: 1080,
        },
      },
    });
    // .then((e) => e.getVideoTracks());

    let track = stream.getVideoTracks();

    localvideoContainer.current!.srcObject = stream;

    connectSendTransport(track[0], "video");
  };

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key={"aisudhnasb"}
          exit={{ opacity: [1, 1, 0] }}
          transition={{ duration: 1 }}
          className="layer w-screen h-screen bg-black pointer-events-none flex items-center justify-center text-3xl font-medium tracking-wide text-white z-[1000] absolute gap-3"
        >
          <Spinner size="lg" /> Loading...
        </motion.div>
      ) : (
        <section className="w-full h-screen bg-[#202124] flex flex-col">
          {false && (
            <div className="topbar py-2 px-6 flex">
              <div className="viewers bg-[#f4bc16] p-2 flex items-center justify-center rounded-md">
                <BiSolidBuildings className="text-xl" />
              </div>
            </div>
          )}
          <motion.div
            layout
            className="responsive-area flex-1 p-2 w-full flex gap-3"
          >
            <VideoArea users={[]} />
            <motion.div className="rightArea w-[clamp(100px,350px,90vw)] h-full bg-white rounded-lg"></motion.div>
          </motion.div>
          <BottomBar />
        </section>
      )}
    </AnimatePresence>
  );
};

export default JoinedRoom;
