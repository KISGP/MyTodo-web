import type { StateCreator } from "zustand";

export type TodoBaseType = {
  id: string;
  title: string;
  time: string;
  content: string;
  isCloudSynced: boolean;
  isSelected: boolean;
  isDone: boolean;
  uid: string;
};

export type TodoItemType = Omit<TodoBaseType, "content">;

export type DataSlice = {
  todo: Pick<TodoBaseType, "id" | "title" | "time" | "content">;

  todoList: TodoItemType[];

  // lexical 编辑器的 id, 用于清空编辑器内容
  editorId: string;
  // 编辑器内容是否改变 (用于判断是否可以修改当前编辑器内容)
  isAllowContentChanged: boolean;
  toggleIsAllowContentChanged: (status: boolean) => void;

  // 将 todo 保存到 localTodo 中初始化 todo
  saveTodo: () => Promise<string>;

  // 保存 todo 的 title
  saveTodo_title: (title: string) => void;

  // 保存 todo 的 time
  saveTodo_time: (ISOtime: string) => void;

  // 保存 todo 的 content
  saveTodo_content: (serializedEditorState: string) => void;
  // 清空编辑器内容
  clearTodo_content: () => void;

  // 创建新的 todo
  createTodo: () => Promise<string>;

  // 删除 todo
  deleteTodo: () => Promise<string>;

  // 修改完成状态
  toggleTodoItemDone: () => Promise<void>;

  // 更改 todoList 的顺序
  reorderTodoList: (sourceIndex: number, destinationIndex: number) => void;

  // 修改 todoItem 的选中状态
  toggleTodoItemSelection: (index: number, status: boolean) => void;

  // 修改所有 todoItem 的选中状态
  toggleAllTodoItemSelection: (status: boolean) => void;

  // 更改当前显示的 todo
  changeCurrentTodo: (index: number) => Promise<void>;
};

export type UserSlice = {
  isLogin: boolean;

  user: {
    uid: string;
    name: string;
    token: string;
    account: string;
    isGuest?: boolean;
  };

  settings: Partial<{
    isCloudSyncEnabled: boolean;
  }>;

  login: () => void;

  loginAsGuest: () => void;

  quit: () => void;
};

export type StoreType = DataSlice & UserSlice;

export type StateTypeWithImmer<T> = StateCreator<StoreType, [["zustand/immer", never]], [], T>;

export type DataStateType = StateTypeWithImmer<DataSlice>;

export type UserStateType = StateTypeWithImmer<UserSlice>;
