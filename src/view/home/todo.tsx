import { memo } from "react";

import ResizeBox from "@/components/layout/resize-box";
import TodoList from "@/components/ui/todo-list.tsx";
import TodoContent from "@/components/ui/todo-content";

const todo = memo(() => {
  return <ResizeBox left={<TodoList />} right={<TodoContent />} />;
});

export default todo;
