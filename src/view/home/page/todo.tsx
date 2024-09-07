import { memo, useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle, getPanelGroupElement } from "react-resizable-panels";

import useToast from "@/hooks/useToast";
import DragIcon from "@/assets/svg/drag.svg?react";
import TodoList from "@/components/ui/todo-list.tsx";
import TodoEditor from "@/components/ui/todo-editor";
import { debounce } from "@/lib/utils";

const todo = memo(() => {
  const [listMinWidth, setListMinWidth] = useState<number>(40);
  const [editorMinWidth, setEditorMinWidth] = useState<number>(60);

  const myToast = useToast();

  // 更新编辑器最大宽度
  useEffect(() => {
    const groupElement = getPanelGroupElement("group");

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        if (entry.target === groupElement) {
          if (groupElement!.offsetWidth < 1200) {
            myToast.warning("窗口过小，部分功能可能无法正常使用");
          } else {
            const listMinWidth = (350 / groupElement!.offsetWidth) * 100;
            const editorMinWidth = (830 / groupElement!.offsetWidth) * 100;

            setListMinWidth(listMinWidth);
            setEditorMinWidth(editorMinWidth);
          }
        }
      }
    };

    const resizeObserver = new ResizeObserver(debounce(handleResize, 100));
    resizeObserver.observe(groupElement!);

    // 清除事件监听器
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <PanelGroup id="group" direction="horizontal">
      <Panel id="left" minSize={listMinWidth} className="mb-1 ml-2 mr-1 mt-2">
        <TodoList />
      </Panel>
      <PanelResizeHandle className="relative">
        <DragIcon className="absolute -left-2 top-1/2 size-4 fill-default-500/50"></DragIcon>
      </PanelResizeHandle>
      <Panel id="right" minSize={editorMinWidth} className="ml-1 mr-2 mt-2">
        <TodoEditor />
      </Panel>
    </PanelGroup>
  );
});

export default todo;
