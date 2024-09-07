import { cn } from "@nextui-org/react";
import React, { useEffect, useRef } from "react";

import CloseIcon from "@/assets/svg/close.svg?react";

export default function ModalContainer({
  onClose,
  children,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target;
      if (modalRef.current !== null && !modalRef.current.contains(target as Node)) {
        onClose();
      }
    };
    const modelElement = modalRef.current;
    if (modelElement !== null) {
      modalOverlayElement = modelElement.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement.addEventListener("click", clickOutsideHandler);
      }
    }

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener("click", clickOutsideHandler);
      }
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      className={cn(
        "fixed bottom-0 left-0 right-0 top-0 z-50",
        "flex flex-shrink flex-grow-0 flex-col items-center justify-center",
      )}
    >
      <div
        className={cn(
          "rounded-xl shadow-lg outline-none",
          "min-h-24 min-w-96 p-5",
          "flex flex-grow-0 flex-col",
          "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800",
        )}
        tabIndex={-1}
        ref={modalRef}
      >
        <div className="mb-6 flex w-full justify-between">
          <span className="text-lg font-bold">{title}</span>
          <CloseIcon
            onClick={onClose}
            className="h-9 w-9 cursor-pointer rounded-full fill-default-500 p-2 hover:bg-default-300"
          />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
