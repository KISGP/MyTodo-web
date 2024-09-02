import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import ModalContainer from "../ui/modal";

type useModalReturn = [
  JSX.Element | null,
  (title: string, showModal: (onClose: () => void) => JSX.Element) => void,
];

export default function useModal(): useModalReturn {
  const [modalContent, setModalContent] = useState<null | {
    title: string;
    content: JSX.Element;
  }>(null);

  const clearModalContent = useCallback(() => {
    setModalContent(null);
  }, []);

  const modal = useMemo(() => {
    if (modalContent === null) {
      return null;
    }

    const { title, content } = modalContent;
    return createPortal(
      <ModalContainer onClose={clearModalContent} title={title}>
        {content}
      </ModalContainer>,
      document.body,
    );
  }, [modalContent, clearModalContent]);

  const showModal = useCallback(
    (title: string, getContent: (onClose: () => void) => JSX.Element) => {
      setModalContent({
        title,
        content: getContent(clearModalContent),
      });
    },
    [clearModalContent],
  );

  return [modal, showModal];
}
