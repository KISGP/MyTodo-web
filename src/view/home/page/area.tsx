import { memo, useEffect, useRef } from "react";
import { createSwapy } from "swapy";

import DragIcon from "@/assets/svg/drag.svg?react";
import { cn } from "@nextui-org/react";
import { useStore } from "@/store";

type areaItem = {
  title: string;
  id: string;
  class: string;
};

const defaultArea: areaItem[] = [
  {
    title: "😦重要不紧急",
    id: "1",
    class: "text-yellow-400",
  },
  {
    title: "🤯重要且紧急",
    id: "2",
    class: "text-red-600",
  },
  {
    title: "😌不重要不紧急",
    id: "3",
    class: "text-green-600",
  },
  {
    title: "🫤不重要紧急",
    id: "4",
    class: "text-blue-600",
  },
];

const Quadrant = memo<{ item: areaItem }>(({ item }) => {
  const [todos] = useStore((state) => [state.todos]);
  return (
    <div key={item.id} className="flex-1" data-swapy-slot={item.id}>
      <div
        className="group relative size-full overflow-hidden rounded-lg border-2 border-default-200/50 bg-content2"
        data-swapy-item={item.id}
      >
        <div className={cn("w-full px-2 py-1 text-lg font-semibold", item.class)}>{item.title}</div>
        <div data-swapy-handle className="invisible absolute left-1/2 top-1 -translate-x-1/2 group-hover:visible">
          <DragIcon className="size-4 rotate-90 cursor-grab fill-default-400 active:cursor-grabbing" />
        </div>
        <div className="scrollbar size-full overflow-y-auto px-2">
          {todos
            .filter((todo) => todo.priority === Number(item.id))
            .map((todo) => (
              <div className="my-1 flex w-full items-center justify-between rounded-md bg-content3/30 px-2 py-1">
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

    swapy.onSwap(({ data }) => {
      console.log("swap", data);
      localStorage.setItem("slotItem", JSON.stringify(data.object));
    });

    swapy.onSwapEnd(({ data, hasChanged }) => {
      console.log(hasChanged);
      console.log("end", data);
    });

    swapy.onSwapStart(() => {
      console.log("start");
    });

    return () => {
      swapy.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="flex size-full flex-col gap-3 p-2">
      <div className="flex h-1/2 gap-3">
        {defaultArea.slice(0, 2).map((item, index) => (
          <Quadrant item={item} key={index} />
        ))}
      </div>
      <div className="flex h-1/2 gap-3">
        {defaultArea.slice(2).map((item, index) => (
          <Quadrant item={item} key={index} />
        ))}
      </div>
    </div>
  );
});

export default Area;
