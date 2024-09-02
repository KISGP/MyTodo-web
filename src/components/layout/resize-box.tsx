import React, { memo, useEffect, useState, useRef } from "react";
import { Resizable } from "re-resizable";

import { debounce } from "@/lib/utils";

// 目前仅用于待办清单页面
const ResizeBox: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
}> = memo(({ left, right }) => {
  const todoContainerRef = useRef<HTMLDivElement | null>(null);
  const [editorMaxWidth, setEditorMaxWidth] = useState<string>("830px");

  // 更新编辑器最大宽度
  useEffect(() => {
    const updateEditorMaxWidth = debounce(() => {
      if (todoContainerRef.current) {
        // 设置编辑器最大宽度 = 父容器宽度 - 待办列表宽度
        setEditorMaxWidth(`${todoContainerRef.current.offsetWidth - 300}px`);
      }
    }, 100);

    updateEditorMaxWidth();

    // 监听窗口大小调整
    window.addEventListener("resize", updateEditorMaxWidth);

    // 清除事件监听器
    return () => {
      window.removeEventListener("resize", updateEditorMaxWidth);
    };
  }, []);

  return (
    <div
      ref={todoContainerRef}
      className="flex size-full marker:overflow-hidden"
    >
      <div className="h-full w-full">{left}</div>
      <Resizable
        className="size-full min-w-fit overflow-hidden border-l-1 border-default-300 dark:border-default-200"
        maxWidth={editorMaxWidth}
        minWidth="830px"
        minHeight="100%"
        maxHeight="100%"
        defaultSize={{
          width: "100px",
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
        {right}
      </Resizable>
    </div>
  );
});

export default ResizeBox;
