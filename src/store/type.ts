import type { StateCreator } from "zustand";

export type TodoBaseType = {
  // 唯一id，保存时自动生成
  id: string;
  // 主题
  title: string;
  // 时间
  time: string;
  // lexical内容
  content: string;
  // 标签
  tagsId: string[];
  // 是否同步到云端
  isCloudSynced: boolean;
  // 是否选中
  isSelected: boolean;
  // 创建人
  uid: string;
  // 是否已完成
  isCompleted: boolean;
  /**
   * @description 优先级
   * @example 1:重要不紧急; 2:重要且紧急; 3:不重要不紧急; 4:不重要紧急;
   * */
  priority: number;
};

export type TempTodoType = Pick<TodoBaseType, "title" | "time" | "content" | "tagsId" | "id" | "priority">;

export type TodoItemType = Omit<TodoBaseType, "content">;

export type TagType = {
  id: string;
  // 列显示的名称，tag
  title: string;
  // 简要描述该列功能
  description?: string;
  // 是否隐藏该列
  isHidden: boolean;
  // 图标
  color: string;
};

export type DataSlice = {
  todos: TodoItemType[];

  /**
   * @description tag 即是看板也是标签，一个标签对应一个看板
   * */
  tags: TagType[];

  /**
   * @description 存放临时 todo 的数据，方便修改以及保存
   * */
  tempTodo: TempTodoType;

  /**
   * @description 通知范围，可以通知消息优先级小于通知等级的消息。0:不通知; 1:仅通知错误; 2:通知成功和错误
   * */
  notificationScope: number;

  // ================== 数据只能由下面方法修改 ==================

  /**
   * @description 保存 todo 到 todos，并保存 content 到 indexDB
   * @returns 如果保存成功则返回 id，否则返回 null
   * */
  save_todo: (value: Omit<TempTodoType, "id">) => Promise<string | null>;

  /**
   * @description 根据 id 删除 todo
   * */
  delete_todo: (id: string[]) => Promise<boolean>;

  /**
   * @description 根据 id 更新单个 todo
   * */
  update_todo: (id: string, value: Partial<Omit<TodoBaseType, "id" | "uid">>) => Promise<boolean>;

  /**
   * @description 将 todos 更新为 fn 的返回值
   * */
  update_todos: (fn: (todos: TodoItemType[]) => TodoItemType[]) => void;

  /**
   * @description 调换 todos 中两个 todo 的顺序
   * @param index 两个 todo 的索引, [sourceIndex, destinationIndex] | [sourceId, destinationId]
   * */
  reorder_todos: (index: [string, string] | [number, number]) => void;

  /**
   * @description 获取 todos 中的某个 todo 的详细信息
   * @param index 两个 todo 的索引, [sourceIndex, destinationIndex] | [sourceId, destinationId]
   * */
  get_todo: (id: string) => Promise<TodoBaseType | null>;

  /**
   * @description 根据 id 更新 tags
   * */
  update_tags: (id: string, value: Partial<Omit<TagType, "id">>) => void;

  /**
   * @description 添加自定义 tag
   * */
  add_tag: (value: Omit<TagType, "id" | "isHidden">) => void;

  /**
   * @description 根据 id 删除 tags
   * @param deleteTodo 是否删除 todo。如果为 false，则将 todo 的 tagsId 中的该 tag 删除。如果为 true，则删除所有包含该 tag 的 todo
   * */
  delete_tag: (id: string, deleteTodo: boolean) => void;

  /**
   * @description 重置显示内容
   * */
  reset_tempTodo: () => void;

  /**
   * @description 更新为 tempTodo
   * */
  update_tempTodo: (value: Partial<TempTodoType>) => void;

  /**
   * @description 更改当前显示（标题，时间，编辑器）内容为传入id 的 todo 的内容
   * */
  change_tempTodo: (id: string) => void;

  /**
   * @description 保存当前 tempTodo
   * */
  save_tempTodo: () => Promise<{ status: boolean; msg: string }>;

  /**
   * @description 更新 notificationScope
   * */
  update_notificationScope: (value: number) => void;

  /**
   * @description 获取所有数据
   * */
  get_AllData: () => Promise<{ todos: TodoBaseType[]; tags: TagType[]; user: userType }>;

  /**
   * @description 导出数据
   * */
  export: () => void;

  /**
   * @description 导入数据
   * */
  import: () => void;

  /**
   * @description 上传数据
   * */
  upload: () => Promise<{ status: boolean; msg: string }>;

  // ================== 仅用于 /todo 页面 ==================

  /**
   * @description 创建一个临时 todo（保存当前 tempTodo, 并重置显示内容）
   * */
  create_tempTodo: () => Promise<{ status: boolean; msg: string }>;

  /**
   * @description 对显示的 todo 列表进行全选或全不选
   * */
  toggle_AllTodoSelected: (status: boolean) => void;

  /**
   * @description 删除选中的 todo
   * */
  delete_selectedTodo: () => Promise<{ status: boolean; msg: string }>;

  /**
   * @description 将选中的 todo 的 isCompleted 状态取反
   * */
  toggle_todoCompleted: () => void;

  // ================== 仅用于 /board 页面 ==================

  /**
   * @description 重新排列看板的顺序
   * */
  reorder_tags: (sourceId: string, destinationId: string) => void;

  /**
   * @description 在看板界面创建 todo
   * */
  save_item: (value: Pick<TempTodoType, "tagsId" | "title">) => void;
};

export type userType = {
  uid: string;
  name: string;
  token: string;
  account: string;
  isGuest?: boolean;
};

export type UserSlice = {
  isLogin: boolean;

  user: userType;

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
