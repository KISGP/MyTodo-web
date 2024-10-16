import { memo, useEffect, useRef } from "react";
import { createSwapy } from "swapy";

import DragIcon from "@/assets/svg/drag.svg?react";
import NoDataIcon from "@/assets/svg/no-data.svg?react";
import { cn } from "@nextui-org/react";
import { useStore, PriorityType } from "@/store";

const Quadrant = memo<{ item: PriorityType }>(({ item }) => {
  const [todos] = useStore((state) => [state.todos]);

  const data = todos.filter((todo) => todo.priority === Number(item.id));

  return (
    <div key={item.id} className="flex-1" data-swapy-slot={item.id}>
      <div
        data-swapy-item={item.id}
        className="group relative size-full overflow-hidden rounded-lg border-2 border-default-200/50 bg-default-50"
      >
        <div className={cn("w-full px-2 py-1 text-lg font-semibold", item.class)}>{`${item.icon} ${item.title}`}</div>

        <div data-swapy-handle className="invisible absolute left-1/2 top-1 -translate-x-1/2 group-hover:visible">
          <DragIcon className="size-4 rotate-90 cursor-grab fill-default-400 active:cursor-grabbing" />
        </div>

        <div className="scrollbar-hidden hover:scrollbar relative size-full overflow-y-auto px-2">
          {data.map((todo) => (
            <div
              key={todo.id}
              className={`my-1 flex w-full items-center justify-between rounded-md bg-content3/30 px-2 py-1`}
            >
              <span className="text-default-600">{todo.title}</span>
              <span className="text-sm text-default-400">{todo.time}</span>
            </div>
          ))}
        </div>
        {data.length === 0 && (
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
            <NoDataIcon className="size-6 fill-default-400" />
            <i className="text-xs text-default-500">暂无数据</i>
          </div>
        )}
      </div>
    </div>
  );
});

const Area = memo(() => {
  const prioritys = useStore((state) => state.prioritys);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const swapy = createSwapy(containerRef.current, {
      swapMode: "hover",
      animation: "dynamic",
    });

    return () => {
      swapy.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="flex size-full flex-col gap-3 p-2">
      <div className="flex h-1/2 gap-3">
        {prioritys.slice(0, 2).map((item, index) => (
          <Quadrant item={item} key={index} />
        ))}
      </div>
      <div className="flex h-1/2 gap-3">
        {prioritys.slice(2).map((item, index) => (
          <Quadrant item={item} key={index} />
        ))}
      </div>
    </div>
  );
});

export default Area;
