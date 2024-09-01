import { cn } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

import Trash from "@/assets/svg/trash.svg?react";

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
      className={cn(
        "group flex cursor-pointer align-middle outline-none",
        "mr-[2px] gap-1 rounded-lg border-0 p-2",
        "hover:bg-default-100 active:bg-default-100 disabled:cursor-not-allowed",
      )}
      aria-label="Clear"
      title="Clear"
    >
      <Trash
        className={cn(
          "inline-block bg-contain",
          "mt-[2px] size-[18px] align-[-0.25em] opacity-60",
          "group-active:opacity-100 group-disabled:opacity-20",
        )}
      />
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
