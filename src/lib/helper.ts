import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { ProducerOptions } from "mediasoup-client/lib/Producer";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/Transport";
import { Socket } from "socket.io-client";
import { params } from "@/lib/constants";
import { SetterOrUpdater } from "recoil";
import { PeerDetailsType } from "@/types/types";

let device: Device;
let rtpCapabilities: RtpCapabilities;
let producerTransport: Transport;
let consumingTransports: string[] = [];
let consumerTransports: {
  consumerTransport: Transport;
  serverConsumerTransportId: string;
  producerId: string;
  consumer: Consumer;
}[] = [];

export const joinRoom = (
  socket: Socket,
  roomId: string,
  setTracks: SetterOrUpdater<MediaStreamTrack | null>,
  peerDetails: PeerDetailsType
) => {
  socket!.emit("joinRoom", { roomName: roomId, peerDetails }, (data: any) => {
    rtpCapabilities = data.rtpCapabilities;
    console.log("creating device", data.rtpCapabilities);
    createDevice(socket, data.rtpCapabilities, setTracks);
  });

  socket!.on("new-producer", ({ producerId }) =>
    signalNewConsumerTransport(producerId, device, socket, setTracks)
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
};

const createDevice = async (
  socket: Socket,
  rtpCapabilities: RtpCapabilities,
  setTracks: SetterOrUpdater<MediaStreamTrack | null>
) => {
  try {
    device = new Device();

    await device.load({
      routerRtpCapabilities: rtpCapabilities!,
    });

    createSendTransport(socket, setTracks);
  } catch (error: any) {
    console.log(error);
    if (error.name === "UnsupportedError")
      console.warn("browser not supported");
  }
};

const createSendTransport = (
  socket: Socket,
  setTracks: SetterOrUpdater<MediaStreamTrack | null>
) => {
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

                if (producersExist) getProducers(socket, device, setTracks);
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

const getProducers = (
  socket: Socket,
  device: Device,
  setTracks: SetterOrUpdater<MediaStreamTrack | null>
) => {
  socket!.emit("getProducers", (producerIds: string[]) => {
    console.log(producerIds);
    // for each of the producer create a consumer
    // producerIds.forEach(id => signalNewConsumerTransport(id))
    producerIds.forEach((e) =>
      signalNewConsumerTransport(e, device, socket, setTracks)
    );
  });
};

const signalNewConsumerTransport = async (
  remoteProducerId: string,
  device: Device,
  socket: Socket,
  setTracks: SetterOrUpdater<MediaStreamTrack | null>
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
        device,
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
  device: Device,
  socket: Socket,
  setTracks: SetterOrUpdater<MediaStreamTrack | null>
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

      //   console.log(videoContainer.current);

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

export const sendVideo = async () => {
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

  connectSendTransport(track[0], "video");
};
