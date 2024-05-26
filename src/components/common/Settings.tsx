"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Select from "react-select";

import Icon from "./Icon";

import { BiVideo } from "react-icons/bi";
import { HiOutlineCog } from "react-icons/hi";
import { MdOutlineSpeaker } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

import { settings, settingsState } from "@/state/atom";

const Settings = () => {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useRecoilState(settingsState);
  const [setting, setSettings] = useRecoilState(settings);

  const audioRef = useRef<HTMLAudioElement>(null);
  const speakerRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [micDevices, setMicDevices] = useState<
    {
      value: MediaDeviceInfo;
      label: string;
    }[]
  >([]);
  const [speakerDevices, setSpeakerDevices] = useState<
    {
      value: MediaDeviceInfo;
      label: string;
    }[]
  >([]);
  const [cameraDevices, setCameraDevices] = useState<
    {
      value: MediaDeviceInfo;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    if (!document) return;
    if (open) {
      document.body.style.height = "100vh";
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.height = "auto";
      document.body.style.overflowY = "scroll";
    }
  }, [open]);

  // Get Devices
  useLayoutEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const micDevices = devices.filter((e) => e.kind == "audioinput");
      const speakerDevices = devices.filter((e) => e.kind == "audiooutput");
      const cameraDevices = devices.filter((e) => e.kind == "videoinput");

      setMicDevices(micDevices.map((e) => ({ value: e, label: e.label })));
      setSpeakerDevices(
        speakerDevices.map((e) => ({ value: e, label: e.label }))
      );
      setCameraDevices(
        cameraDevices.map((e) => ({ value: e, label: e.label }))
      );

      setSettings({ ...setting, microphone: micDevices[0] });
      setSettings({ ...setting, speaker: speakerDevices[0] });
      setSettings({ ...setting, camera: cameraDevices[0] });
    };
    getDevices();
  }, []);

  // Add Camera
  useEffect(() => {
    const videoElement = videoRef.current;

    const addVideo = async () => {
      if (videoRef === null || setting.camera?.deviceId === undefined) return;

      console.log(videoElement);

      if (!open) {
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: setting.camera?.deviceId },
        });
        if (videoElement!.srcObject !== stream) {
          videoElement!.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing video stream:", error);
      }
    };
    addVideo();

    return () => {
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setting.camera, open]);

  // Add Audio
  useEffect(() => {
    const audioElement = audioRef.current;

    const addAudio = async () => {
      if (audioRef === null || setting.microphone?.deviceId === undefined)
        return;

      console.log(audioElement);

      if (!open) {
        if (audioElement && audioElement.srcObject) {
          const stream = audioElement.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: setting.microphone?.deviceId },
        });
        if (audioElement!.srcObject !== stream) {
          audioElement!.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing audio stream:", error);
      }
    };
    addAudio();

    return () => {
      if (audioElement && audioElement.srcObject) {
        const stream = audioElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setting.microphone, open]);

  return (
    <section
      className="w-screen h-screen absolute flex items-center justify-center bg-black/25 z-[500]"
      style={{
        background: open ? "rgba(0,0,0,0.25)" : "transparent",
        pointerEvents: open ? "all" : "none",
      }}
    >
      {open && (
        <div
          className="outer absolute w-full h-full z-[600]"
          onClick={(e) => setOpen(false)}
        ></div>
      )}
      {open ? (
        <div className="wrapper w-[clamp(200px,85%,800px)]  h-[92vh] rounded-md bg-white flex z-[700]">
          <div className="menu flex flex-col w-[clamp(50px,260px,300px)]">
            <div className="heading text-xl p-6 hidden md:flex">Settings</div>
            <div className="menu flex flex-col mt-10 md:mt-2 pr-2 font-medium text-black/50 text-[13px]">
              <div
                className={`item px-4 md:px-6 flex gap-2 items-center w-full rounded-r-full py-3 ${
                  tab == 0
                    ? "bg-[#e0ebfc]/90 text-[#174fa7]"
                    : "hover:bg-black/5"
                }`}
                onClick={(e) => setTab(0)}
              >
                <MdOutlineSpeaker className="text-2xl" />
                <span className="hidden md:flex">Audio</span>
              </div>
              <div
                className={`audio px-4 md:px-6 flex gap-2 items-center w-full rounded-r-full py-3 ${
                  tab == 1
                    ? "bg-[#e0ebfc]/90 text-[#174fa7]"
                    : "hover:bg-black/5"
                }`}
                onClick={(e) => setTab(1)}
              >
                <BiVideo className="text-2xl" />
                <span className="hidden md:flex">Video</span>
              </div>
              <div
                className={`audio px-4 md:px-6 flex gap-2 items-center w-full rounded-r-full py-3 ${
                  tab == 2
                    ? "bg-[#e0ebfc]/90 text-[#174fa7]"
                    : "hover:bg-black/5"
                }`}
                onClick={(e) => setTab(2)}
              >
                <HiOutlineCog className="text-2xl" />
                <span className="hidden md:flex">General</span>
              </div>
            </div>
          </div>
          <div className="devider w-[.8px] h-full bg-black/20 flex-shrink-0"></div>
          <div className="content flex-1">
            <div className="heading flex items-center justify-end text-2xl px-3 py-2">
              <Icon onClick={(e) => setOpen(false)}>
                <IoCloseOutline />
              </Icon>
            </div>
            <div className="settings flex flex-col flex-1 gap-5 p-6 pr-12">
              {tab === 0 ? (
                <>
                  <div className="item flex flex-col gap-1">
                    <div className="heading text-[#3583eb] text-sm font-medium">
                      Microphone
                    </div>
                    <div className="inputs flex items-center gap-6 justify-center md:justify-between flex-wrap">
                      <Select
                        key={"mic"}
                        className="w-[150px] md:w-[250px] flex border-[.5px] focus:border-black/30"
                        defaultValue={
                          setting.microphone
                            ? {
                                value: setting.microphone,
                                label: setting.microphone.label,
                              }
                            : micDevices[0]
                        }
                        onChange={(e) => {
                          setSettings({ ...setting, microphone: e?.value });
                        }}
                        options={micDevices}
                      />
                      <div className="soundbar">
                        <audio ref={audioRef}></audio>
                      </div>
                    </div>
                  </div>
                  <div className="item flex flex-col gap-1">
                    <div className="heading text-[#3583eb] text-sm font-medium">
                      Speaker
                    </div>
                    <div className="inputs flex items-center gap-6 justify-center md:justify-between flex-wrap">
                      <Select
                        key={"speaker"}
                        className="w-[150px] md:w-[250px] border-[.5px] focus:border-black/30"
                        defaultValue={
                          setting.speaker
                            ? {
                                value: setting.speaker,
                                label: setting.speaker.label,
                              }
                            : speakerDevices[0]
                        }
                        onChange={(e) => {
                          setSettings({ ...setting, speaker: e?.value });
                        }}
                        options={speakerDevices}
                      />
                      <button className="test px-4 py-3 -ml-4 rounded-full hover:text-[#3583eb] hover:bg-[#3583eb]/5 text-sm">
                        Test
                      </button>
                    </div>
                  </div>
                </>
              ) : tab === 1 ? (
                <>
                  <div className="item flex flex-col gap-1">
                    <div className="heading text-[#3583eb] text-sm font-medium">
                      Camera
                    </div>
                    <div className="inputs flex items-center gap-6 justify-center md:justify-between flex-wrap">
                      <Select
                        key={"camera"}
                        className="w-[150px] md:w-[250px] border-[.5px] focus:border-black/30"
                        defaultValue={
                          setting.camera
                            ? {
                                value: setting.camera,
                                label: setting.camera.label,
                              }
                            : cameraDevices[0]
                        }
                        onChange={(e) => {
                          setSettings({ ...setting, camera: e?.value });
                        }}
                        options={cameraDevices}
                      />
                      <div className="camera-display w-[105px] aspect-[16/8.5] bg-black">
                        <video
                          className="w-full h-full object-cover"
                          ref={videoRef}
                        ></video>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="item flex flex-col gap-1"></div>
              )}
            </div>
          </div>
        </div>
      ) : (
        false
      )}
    </section>
  );
};

export default Settings;
