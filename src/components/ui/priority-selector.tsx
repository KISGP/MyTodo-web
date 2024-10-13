import { memo, useState } from "react";
import type { Selection } from "@nextui-org/react";
import { cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { areaData } from "@/constant";

const PrioritySelector = memo<{
  onAction: (key: number) => void;
}>(({ onAction }) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["3"]));

  const selectedPriority = areaData.find((item) => item.id === Array.from(selectedKeys)[0]);

  return (
    <Dropdown placement="top-start">
      <DropdownTrigger>
        <button className="outline-none">
          <div
            className={cn("rounded-full border-2 border-default-200 px-2 py-[2px] text-sm", selectedPriority?.class)}
          >
            {`${selectedPriority?.icon} ${selectedPriority?.title}`}
          </div>
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
        {areaData.map((area) => (
          <DropdownItem key={area.id}>
            <span className={area.class}>{`${area.icon} ${area.title}`}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
});

export default PrioritySelector;
