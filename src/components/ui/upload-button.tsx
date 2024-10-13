import { memo, useState } from "react";
import { Button } from "@nextui-org/react";
import { useStore } from "@/store";

import Sync from "@/assets/svg/sync.svg?react";
import Refresh from "@/assets/svg/refresh.svg?react";
import useToast from "@/hooks/useToast";

const Upload = memo(() => {
  const [upload, isGuest, notificationScope] = useStore((state) => [
    state.upload,
    state.user.isGuest,
    state.notificationScope,
  ]);

  if (!isGuest) return null;

  const [isUploading, setIsUploading] = useState(false);

  const myToast = useToast(notificationScope);

  return (
    <Button
      isIconOnly
      size="sm"
      radius="full"
      title="云同步"
      variant="light"
      onClick={() => {
        if (isUploading) return;

        setIsUploading(true);
        upload().then(({ status, msg }) => {
          if (status) {
            myToast.success(msg, { messagePriority: 1 });
          } else {
            myToast.error(msg, { messagePriority: 1 });
          }
          setIsUploading(false);
        });
      }}
    >
      {isUploading ? (
        <Refresh className="size-6 animate-spin fill-default-500" />
      ) : (
        <Sync className="size-6 fill-default-500" />
      )}
    </Button>
  );
});

export default Upload;
