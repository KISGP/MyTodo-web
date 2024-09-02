import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

import Trash from "@/assets/svg/trash.svg?react";

import { toolbarIconClass, toolbarButtonClass } from "../../theme";

type ToolbarButtonProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  clear: () => void;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function RedoButton({
  isOpen,
  onOpenChange,
  clear,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={toolbarButtonClass}
      aria-label="Clear"
      title="Clear"
    >
      <Trash className={toolbarIconClass} />
      <Modal size="xs" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <p className="ml-4 mt-10 text-lg">是否删除所有内容</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    clear();
                  }}
                >
                  删除
                </Button>
                <Button color="primary" onPress={onClose}>
                  取消
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </button>
  );
}
