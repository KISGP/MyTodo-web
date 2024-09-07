import { memo } from "react";
import { DatePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";
import { formatDateString } from "@/lib/utils";

import useToast from "@/hooks/useToast";

import LexicalEditor from "./editor";

const TodoEditor = memo(() => {
  const [time, saveTodo, saveTodo_title, saveTodo_time] = useStore((state) => [
    state.todo.time,
    state.saveTodo,
    state.saveTodo_title,
    state.saveTodo_time,
  ]);

  const title = useStore(useShallow((state) => state.todo.title));

  const myToast = useToast();

  return (
    <div id="editorContainer" className="relative size-full">
      <div className="mb-2 flex h-16 w-full items-center justify-between gap-16 rounded-xl bg-content2 px-2">
        <input
          id="todo-title-input"
          type="text"
          placeholder="标题"
          value={title || ""}
          className="h-3/4 flex-grow rounded-xl bg-transparent px-4 text-2xl font-semibold caret-default-500 outline-none placeholder:text-default-300"
          onChange={(e) => saveTodo_title(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            e.key === "Enter" && myToast.promise(saveTodo());
          }}
        />
        <DatePicker
          showMonthAndYearPickers
          aria-label="DatePicker"
          value={parseDate(time)}
          classNames={{ base: "w-fit" }}
          dateInputClassNames={{ inputWrapper: "shadow-none" }}
          onChange={({ year, month, day }) => saveTodo_time(formatDateString(year, month, day))}
        />
      </div>
      <LexicalEditor />
    </div>
  );
});

export default TodoEditor;
