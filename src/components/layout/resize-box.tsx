import React, { memo } from "react";
import { Resizable } from "re-resizable";

const ResizeBox: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
}> = memo(({ left, right }) => {
  return (
    <div className="flex size-full marker:overflow-hidden">
      <Resizable
        className="size-full border-r-1 border-default-300 dark:border-default-200"
        maxWidth="60%"
        minWidth="200px"
        minHeight="100%"
        maxHeight="100%"
        defaultSize={{
          width: "30%",
          height: "100%",
        }}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        {left}
      </Resizable>
      <div className="h-full w-full">{right}</div>
    </div>
  );
});

export default ResizeBox;
