import { useStore } from "@/store";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/react";
import { memo, useState } from "react";
import FilterIcon from "@/assets/svg/filter.svg?react";
import type { Selection } from "@nextui-org/react";
import { TagCircle } from "./tag";

const TodoFilter = memo<{ onAction: (res: { type: string; id: string } | null) => void }>(({ onAction }) => {
  const [tags, prioritys] = useStore((state) => [state.tags, state.prioritys]);

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  return (
    <Dropdown classNames={{ content: "min-w-fit" }}>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <FilterIcon className="size-4 fill-default-800/80 dark:fill-default-400/80" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          setSelectedKeys(keys);

          const key = Array.from(keys)[0] as string;

          if (!key) onAction(null);

          if (key.length === 1) {
            // 因为优先级的id是1,2,3,4
            onAction({
              type: "priority",
              id: key,
            });
          } else {
            onAction({
              type: "tag",
              id: key,
            });
          }
        }}
      >
        <DropdownSection title="标签" showDivider>
          {tags.map((tag) => (
            <DropdownItem key={tag.id} title={tag.title} startContent={<TagCircle color={tag.color} />} />
          ))}
        </DropdownSection>
        <DropdownSection title="优先级">
          {prioritys.map((item) => (
            <DropdownItem key={item.id}>
              <span className={item.class}>
                {item.icon} {item.title}
              </span>
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
});

export default TodoFilter;
