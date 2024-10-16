import { memo, useState } from "react";
import type { Selection } from "@nextui-org/react";
import { cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useStore, PriorityType } from "@/store";

export const Priority = memo<{
  priority?: PriorityType;
}>(({ priority }) => (
  <div
    className={cn("rounded-full border-1 border-default-200 bg-default-100/50 px-2 py-[2px] text-sm", priority?.class)}
  >
    {`${priority?.icon} ${priority?.title}`}
  </div>
));

export const PrioritySelector = memo<{
  onAction: (key: number) => void;
}>(({ onAction }) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["3"]));

  const prioritys = useStore((state) => state.prioritys);

  const selectedPriority = prioritys.find((item) => item.id === parseInt(Array.from(selectedKeys)[0] as string));

  return (
    <Dropdown placement="top-start">
      <DropdownTrigger>
        <button className="outline-none">
          <Priority priority={selectedPriority} />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          if (Array.from(keys).length == 0) return;
          setSelectedKeys(keys);
          onAction(parseInt(Array.from(keys)[0] as string));
        }}
      >
        {prioritys.map((priority) => (
          <DropdownItem key={priority.id}>
            <span className={priority.class}>{`${priority.icon} ${priority.title}`}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
});

export default PrioritySelector;
