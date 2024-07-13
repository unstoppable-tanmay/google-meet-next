import { Modal, ModalContent, ModalBody, Avatar } from "@nextui-org/react";
import React from "react";

type Props = {
  user: {
    image?: string | undefined | null;
    name?: string | undefined | null;
    email?: string | undefined | null;
  } | null;
  onAdmit: () => void;
  onDeny: () => void;
};

const AskingComp = ({ user,onAdmit, onDeny }: Props) => {
  return (
    <Modal
      className="w-max justify-end"
      classNames={{
        wrapper: "justify-end",
        backdrop: "pointer-events-none hidden",
      }}
      isOpen={true}
      hideCloseButton={true}
      placement="bottom"
    >
      <ModalContent>
        <>
          <ModalBody className="bg-[#404145] rounded-lg p-8 px-10 flex text-white w-max gap-3">
            <div className="heading font-semibold">
              Someone wants to join this call
            </div>
            <div className="user flex items-center justify-start gap-3">
              <Avatar
                className="border-[2px] border-[#d9dbdb]"
                src={user?.image ?? ""}
              />
              <div className="name font-medium text-sm">{user?.name}</div>
            </div>
            <div className="buttons flex items-center justify-end gap-5">
              <button
                className="font-semibold text-[#87a8d3]"
                onClick={onAdmit}
              >
                Admit
              </button>
              <button
                className="font-semibold text-[#87a8d3]"
                onClick={onDeny}
              >
                Deny
              </button>
            </div>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};

export default AskingComp;
