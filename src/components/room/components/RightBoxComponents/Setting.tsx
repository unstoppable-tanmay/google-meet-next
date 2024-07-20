import React from "react";
import { IoClose } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { MdDone } from "react-icons/md";
import { settings } from "@/state/atom";
import { useRecoilState } from "recoil";
import { Radio, RadioGroup, Switch } from "@nextui-org/react";
import { meetDetailsAtom } from "@/state/JoinedRoomAtom";

const Setting = () => {
  const pathname = usePathname();
  const [setting, setSettings] = useRecoilState(settings);
  const [meetDetails, setMeetDetails] = useRecoilState(meetDetailsAtom);

  return (
    <div className="flex flex-col">
      <div className="header p-6 flex items-center justify-between text-[#5c5c5e]">
        <div className="heading font-medium text-xl">Host Controls</div>
        <IoClose
          className="text-2xl cursor-pointer"
          onClick={(e) => {
            setSettings((prev) => ({ ...prev, setting: false }));
          }}
        />
      </div>
      <div className="message text-black/70p-6 mb-4 px-6 text-sm text-black/50 font-medium">
        Use these host settings to keep control of your meeting. Only hosts have
        access to these controls.
      </div>
      <div className="devider w-full h-[1px] bg-black/10 mt-2"></div>
      <div className="heading text-black/60 text-xs font-bold my-4 mx-6">
        MEETING MODERATION
      </div>
      <div className="devider w-full h-[1px] bg-black/10"></div>

      <div className="hostmanagement mx-6 mt-6 mb-4">
        <div className="header flex items-center justify-between">
          <div className="heading font-semibold">Host management</div>
          <Switch
            isSelected={meetDetails?.settings.hostManagement}
            onValueChange={(e) => {
              setMeetDetails((prev) => ({
                ...prev!,
                settings: { ...prev!.settings, hostManagement: e },
              }));
            }}
            size="md"
            color="default"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <MdDone className={className} />
              ) : (
                <IoClose className={className} />
              )
            }
          ></Switch>
        </div>
        <div className="desc text-xs w-[80%]">
          Lets you restrict what participants can do in the meeting.{" "}
          <span className="text-blue-500">Learn more</span>
        </div>

        <div className="semiheading text-black/50 text-xs font-bold mt-4 pl-4">
          LET EVERYONE
        </div>
        <div className="header flex items-center justify-between mt-4 pl-4">
          <div className="heading text-sm font-semibold">
            Share Their Screen
          </div>
          <Switch
            isDisabled={!meetDetails?.settings.hostManagement}
            onValueChange={(e) => {
              setMeetDetails((prev) => ({
                ...prev!,
                settings: { ...prev!.settings, shareScreen: e },
              }));
            }}
            size="md"
            color="default"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <MdDone className={className} />
              ) : (
                <IoClose className={className} />
              )
            }
          ></Switch>
        </div>
        <div className="header flex items-center justify-between mt-4 pl-4">
          <div className="heading text-sm font-semibold">
            Send Chat Messages
          </div>
          <Switch
            isDisabled={!meetDetails?.settings.hostManagement}
            onValueChange={(e) => {
              setMeetDetails((prev) => ({
                ...prev!,
                settings: { ...prev!.settings, sendChatMessage: e },
              }));
            }}
            size="md"
            color="default"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <MdDone className={className} />
              ) : (
                <IoClose className={className} />
              )
            }
          ></Switch>
        </div>
        <div className="header flex items-center justify-between mt-4 pl-4">
          <div className="heading text-sm font-semibold">Send Reaction</div>
          <Switch
            isDisabled={!meetDetails?.settings.hostManagement}
            onValueChange={(e) => {
              setMeetDetails((prev) => ({
                ...prev!,
                settings: { ...prev!.settings, sendReaction: e },
              }));
            }}
            size="md"
            color="default"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <MdDone className={className} />
              ) : (
                <IoClose className={className} />
              )
            }
          ></Switch>
        </div>
        <div className="header flex items-center justify-between mt-4 pl-4">
          <div className="heading text-sm font-semibold">
            Turn On Their Microphone
          </div>
          <Switch
            isDisabled={!meetDetails?.settings.hostManagement}
            onValueChange={(e) => {
              setMeetDetails((prev) => ({
                ...prev!,
                settings: { ...prev!.settings, turnOnMic: e },
              }));
            }}
            size="md"
            color="default"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <MdDone className={className} />
              ) : (
                <IoClose className={className} />
              )
            }
          ></Switch>
        </div>
        <div className="desc text-xs w-[80%] mt-2 ml-4 font-semibold text-black/50">
          Turning this off might remove people using an outdated Meet app or
          non-Google meeting hardware. They can rejoin when its turned on again.
        </div>
        <div className="header flex items-center justify-between mt-4 pl-4">
          <div className="heading text-sm font-semibold">
            Turn On Their Video
          </div>
          <Switch
            isDisabled={!meetDetails?.settings.hostManagement}
            onValueChange={(e) => {
              setMeetDetails((prev) => ({
                ...prev!,
                settings: { ...prev!.settings, turnOnVideo: e },
              }));
            }}
            size="md"
            color="default"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <MdDone className={className} />
              ) : (
                <IoClose className={className} />
              )
            }
          ></Switch>
        </div>
        <div className="desc text-xs w-[80%] mt-2 ml-4 font-semibold text-black/50">
          {`Turning this off might remove people using an outdated Meet app or
          non-Google meeting hardware. They can rejoin when it's turned on
          again.`}
        </div>
      </div>

      <div className="devider w-full h-[1px] bg-black/10 mt-2"></div>
      <div className="heading text-black/60 text-xs font-bold my-4 mx-6">
        MEETING ACCESS
      </div>
      <div className="devider w-full h-[1px] bg-black/10"></div>

      <div className="hostmanagement mx-6 mt-6 mb-4">
        <div className="desc text-xs w-[80%] font-semibold text-black/50">
          These settings also apply to future instances of this meeting
        </div>
        <div className="header flex items-center justify-between mt-4">
          <div className="heading font-semibold">
            Host must join before anyone else
          </div>
          <Switch
            onValueChange={(e) => {
              setMeetDetails((prev) => ({
                ...prev!,
                settings: { ...prev!.settings, hostMustJoinBeforeAll: e },
              }));
            }}
            size="md"
            color="default"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <MdDone className={className} />
              ) : (
                <IoClose className={className} />
              )
            }
          ></Switch>
        </div>
        <div className="heading font-semibold mt-4">Meeting access type</div>
        <RadioGroup
          color="warning"
          className="mt-4 ml-4"
          value={meetDetails?.settings.access}
          onValueChange={(e) => {
            setMeetDetails((prev) => ({
              ...prev!,
              settings: { ...prev!.settings, access: e as "open" | "trusted" },
            }));
          }}
        >
          <Radio
            value="open"
            description="No one has to ask to join. Anyone can dial
in."
            classNames={{ base: "items-start", labelWrapper: "-mt-0.5" }}
          >
            Open
          </Radio>
          <Radio
            value="trusted"
            description="People can join without asking if they're
invited using their Google Account. Everyone
else must ask to join. Anyone can dial in by
phone."
            className="mt-3"
            classNames={{ base: "items-start", labelWrapper: "-mt-0.5" }}
          >
            Trusted
          </Radio>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Setting;
