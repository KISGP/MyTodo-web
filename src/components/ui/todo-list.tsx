import React, { memo, useState } from "react";
import { CheckboxGroup, Checkbox, cn, Button } from "@nextui-org/react";

import Delete from "@/assets/svg/delete.svg?react";
import Add from "@/assets/svg/add.svg?react";

type TodoItemProps = {
  id: string;
  title: string;
  time?: string;
};

const TodoItem: React.FC<TodoItemProps> = memo(({ id, title, time }) => {
  return (
    <Checkbox
      value={id}
      classNames={{
        base: cn(
          "m-0 inline-flex w-full max-w-full bg-content1",
          "items-center justify-start hover:bg-content2",
          "cursor-pointer gap-2 rounded-lg p-4",
          "data-[selected=true]:bg-primary-200/20",
        ),
        label: "w-full",
      }}
    >
      <div className="flex w-full items-center justify-between">
        <span className="block font-semibold text-foreground/80">{title}</span>
        <span className="text-sm text-foreground/60">{time}</span>
      </div>
    </Checkbox>
  );
});

const list: TodoItemProps[] = [
  {
    id: "12434231",
    title: "吃饭",
    time: "2021-09-01",
  },
  {
    id: "5681231",
    title: "睡觉",
    time: "2021-09-02",
  },
  {
    id: "7682342",
    title: "洗澡",
    time: "2021-09-03",
  },
];

const TodoList = memo(() => {
  const [groupSelected, setGroupSelected] = useState<string[]>([]);

  return (
    <div className="size-full pl-2 pr-3 pt-1">
      <div className="mb-2 flex h-10 w-full items-center justify-between">
        <span className="font-bold text-foreground/70">清单列表</span>
        <div className="flex gap-1">
          <Button isIconOnly size="sm" variant="flat">
            <Delete className="h-5 w-5 fill-default-800/80 dark:fill-default-400/80" />
          </Button>
          <Button isIconOnly size="sm" variant="flat">
            <Add className="h-5 w-5 fill-default-800/80 dark:fill-default-400/80" />
          </Button>
        </div>
      </div>

      <CheckboxGroup
        value={groupSelected}
        onChange={setGroupSelected}
        classNames={{
          base: "w-full",
        }}
      >
        {list.map((item) => {
          return <TodoItem key={item.id} {...item}></TodoItem>;
        })}
      </CheckboxGroup>
    </div>
  );
});

export default TodoList;
