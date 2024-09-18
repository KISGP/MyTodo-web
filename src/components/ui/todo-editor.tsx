import { memo } from "react";
import { DatePicker, Listbox, Popover, PopoverTrigger, PopoverContent, Button, ListboxItem } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";
import { formatDateString } from "@/lib/utils";

import LexicalEditor from "./editor";
import useToast from "@/hooks/useToast";
import AddIcon from "@/assets/svg/add.svg?react";
import Tag from "./tag";

const TodoEditor = memo(() => {
  const [time, selectedTags, save_tempTodo, update_tempTodo] = useStore((state) => [
    state.tempTodo.time,
    state.tempTodo.tags,
    state.save_tempTodo,
    state.update_tempTodo,
  ]);
  const [title, tags] = useStore(useShallow((state) => [state.tempTodo.title, state.tags]));

  const myToast = useToast();

  return (
    <div id="editorContainer" className="relative size-full">
      <div className="mb-2 flex h-16 w-full items-center justify-between gap-16 rounded-xl border border-default-200 px-2 py-2 transition-colors dark:border-default-100">
        <input
          id="todo-title-input"
          type="text"
          placeholder="标题"
          value={title || ""}
          className="h-3/4 flex-grow rounded-xl bg-transparent px-4 text-2xl font-semibold caret-default-500 outline-none placeholder:text-default-300"
          onChange={(e) => update_tempTodo({ title: e.target.value })}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            e.key === "Enter" && myToast.auto(save_tempTodo());
          }}
        />
        <DatePicker
          showMonthAndYearPickers
          aria-label="DatePicker"
          value={parseDate(time)}
          classNames={{ base: "w-fit" }}
          dateInputClassNames={{ inputWrapper: "shadow-none" }}
          onChange={({ year, month, day }) => update_tempTodo({ time: formatDateString(year, month, day) })}
        />
      </div>
      <div className="relative w-full rounded-xl border border-default-200 py-2 text-left text-base font-normal transition-colors dark:border-default-100 dark:text-default-500/80">
        <LexicalEditor />
        <div className="flex items-center gap-2 px-2">
          {selectedTags.map((id) => (
            <Tag tag={tags.find((item) => item.id === id)!} icon="!size-3" />
          ))}
          <Popover placement="top-start">
            <PopoverTrigger>
              <Button isIconOnly radius="full" size="sm" className="bg-default-100">
                <AddIcon className="size-4 fill-default-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1">
              <Listbox
                variant="flat"
                aria-label="Listbox"
                selectionMode="single"
                selectedKeys={selectedTags}
                onSelectionChange={(keys: any) => update_tempTodo({ tags: Array.from(keys) })}
              >
                {tags
                  .filter((item) => item.id !== "NoTag")
                  .map((tag) => (
                    <ListboxItem
                      key={tag.id}
                      title={tag.title}
                      description={tag.description}
                      startContent={<div className={tag.icon}></div>}
                      classNames={{ description: "text-xs !text-default-400" }}
                    />
                  ))}
              </Listbox>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
});

export default TodoEditor;
