import { memo } from "react";
import { DatePicker, cn } from "@nextui-org/react";

import Editor from "./editor";

const TodoContent = memo(() => {
  return (
    <div className="size-full">
      <div className="flex h-16 w-full items-center justify-between gap-16 pl-3 pr-6">
        <input
          type="text"
          placeholder="标题"
          className={cn(
            "h-3/4 flex-grow rounded-xl border-none px-4 text-2xl font-semibold outline-none",
            "bg-default-50 caret-default-500 placeholder:text-default-200 dark:bg-default-100/50 placeholder:dark:text-default-100",
          )}
        />
        <DatePicker className="w-fit" />
      </div>
      <Editor />
    </div>
  );
});

export default TodoContent;
