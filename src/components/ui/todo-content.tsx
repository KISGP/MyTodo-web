import { memo } from "react";
import { DatePicker } from "@nextui-org/react";

import Editor from "./editor";

const TodoContent = memo(() => {
  return (
    <div className="size-full">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <input
          type="text"
          placeholder="标题"
          className="h-full caret-default-500 w-1/2 border-none bg-transparent text-2xl font-semibold outline-none"
        />
        <DatePicker className="w-fit" />
      </div>
      <Editor />
    </div>
  );
});

export default TodoContent;
