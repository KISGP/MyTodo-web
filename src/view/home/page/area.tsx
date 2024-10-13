import { memo, useEffect, useRef } from "react";
import { createSwapy } from "swapy";

import DragIcon from "@/assets/svg/drag.svg?react";
import { cn } from "@nextui-org/react";
import { useStore } from "@/store";

import { areaData } from "@/constant";

const Quadrant = memo<{ item: { icon: string; title: string; id: string; class: string } }>(({ item }) => {
  const [todos] = useStore((state) => [state.todos]);

  return (
    <div key={item.id} className="flex-1" data-swapy-slot={item.id}>
      <div
        data-swapy-item={item.id}
        className="group relative size-full overflow-hidden rounded-lg border-2 border-default-200/50 bg-content2"
      >
        <div className={cn("w-full px-2 py-1 text-lg font-semibold", item.class)}>{`${item.icon} ${item.title}`}</div>

        <div data-swapy-handle className="invisible absolute left-1/2 top-1 -translate-x-1/2 group-hover:visible">
          <DragIcon className="size-4 rotate-90 cursor-grab fill-default-400 active:cursor-grabbing" />
        </div>

        <div className="scrollbar-hidden hover:scrollbar relative size-full overflow-y-auto px-2">
          {todos
            .filter((todo) => todo.priority === Number(item.id))
            .map((todo) => (
              <div
                key={todo.id}
                className={`my-1 flex w-full items-center justify-between rounded-md bg-content3/30 px-2 py-1`}
              >
                <span className="text-default-600">{todo.title}</span>
                <span className="text-sm text-default-400">{todo.time}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
});

const Area = memo(() => {
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
        {areaData.slice(0, 2).map((item, index) => (
          <Quadrant item={item} key={index} />
        ))}
      </div>
      <div className="flex h-1/2 gap-3">
        {areaData.slice(2).map((item, index) => (
          <Quadrant item={item} key={index} />
        ))}
      </div>
    </div>
  );
});

export default Area;
