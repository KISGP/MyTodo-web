import { memo } from "react";
import { DatePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";
import { formatDateString } from "@/lib/utils";

import LexicalEditor from "./editor";
import useToast from "@/hooks/useToast";
import { TagSelector } from "./tag";

const TodoEditor = memo(() => {
  const [id, time, save_tempTodo, update_tempTodo] = useStore((state) => [
    state.tempTodo.id,
    state.tempTodo.time,
    state.save_tempTodo,
    state.update_tempTodo,
  ]);

  const [title, tagsId] = useStore(useShallow((state) => [state.tempTodo.title, state.tempTodo.tagsId]));

  const myToast = useToast();

  return (
    <div id="editorContainer" className="relative size-full">
      <div className="mb-2 flex h-16 w-full items-center justify-between gap-16 rounded-xl border border-default-200 px-2 py-2 transition-colors dark:border-default-100">
        <input
          id="todo-title-input"
          type="text"
          placeholder="主题"
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
        <LexicalEditor toolbar action classNames={{ contentEditable: "h-[calc(100vh_-_259px)]" }} />
        <div className="flex items-center gap-2 px-2">
          <TagSelector
            showDescription
            placement="top-start"
            tagId={tagsId[0]}
            onAction={(key) => {
              update_tempTodo({ tagsId: [key] });
              id && save_tempTodo();
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default TodoEditor;
