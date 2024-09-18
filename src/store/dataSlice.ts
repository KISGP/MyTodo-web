import IndexedDBHelper from "@/lib/indexedDB";
import { generateLocalID } from "@/lib/utils";
import { DataStateType } from "./type";
import { tags } from "@/constant";

const DB = new IndexedDBHelper();

export const defaultTodo = {
  id: "",
  title: "",
  time: new Date().toISOString().slice(0, 10),
  content:
    '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
  tagsId: [],
};

export const createDataSlice: DataStateType = (set, get) => ({
  todos: [],

  tags: [
    {
      ...tags.NoTag,
      isHidden: false,
    },
    {
      ...tags.Backlog,
      isHidden: false,
    },
    {
      ...tags.Ready,
      isHidden: false,
    },
    {
      ...tags.InProgress,
      isHidden: false,
    },
    {
      ...tags.InReview,
      isHidden: false,
    },
    {
      ...tags.Done,
      isHidden: false,
    },
    {
      ...tags.GiveUp,
      isHidden: false,
    },
  ],

  save_todo: async (value) => {
    // 为新的 todo 添加一些必要的属性
    const { id, uid, content, ...other } = {
      ...value,
      id: generateLocalID(),
      isCloudSynced: false,
      isSelected: true,
      uid: get().user.uid,
    };

    // 保存到 indexedDB
    const status = await DB.add({ id, uid, content });
    if (!status) return null;

    // 添加到 todos
    set((state) => {
      state.todos.unshift({ id, uid, ...other });
    });

    return id;
  },

  delete_todo: async (ids) => {
    const successIds: string[] = [];

    // 从 indexedDB 中删除, 并记录删除失败的 id
    for (const id of ids) {
      if (await DB.delete(id)) successIds.push(id);
    }

    // 从 todos 中删除
    set((state) => {
      state.todos = state.todos.filter((item) => !successIds.includes(item.id));
    });

    // 如果删除成功的 id 数量不等于 ids 的长度则说明删除失败（部分失败）
    return ids.length === successIds.length;
  },

  update_todo: async (id, value) => {
    const { content, ...other } = value;

    // 更新 indexedDB
    if (content) {
      const status = await DB.update(id, content);
      if (!status) return false;
    }

    // 更新 todos
    set((state) => {
      const index = state.todos.findIndex((item) => item.id === id);
      state.todos[index] = { ...state.todos[index], ...other };
    });

    return true;
  },

  update_todos: (fn) => {
    set((state) => {
      state.todos = fn(state.todos);
    });
  },

  reorder_todos: (index) => {
    const list = [...get().todos];

    let sourceIndex, destinationIndex;

    if (typeof index[0] === "string") {
      let [sourceId, destinationId] = index as [string, string];

      for (let i = 0; i < list.length; i++) {
        switch (list[i].id) {
          case sourceId:
            sourceIndex = i;
            break;
          case destinationId:
            destinationIndex = i;
            break;
        }
      }
    } else {
      sourceIndex = index[0] as number;
      destinationIndex = index[1] as number;
    }
    if (sourceIndex == undefined || destinationIndex == undefined) return;

    const [removed] = list.splice(sourceIndex, 1);
    list.splice(destinationIndex, 0, removed);

    set({ todos: list });
  },

  get_todo: async (id) => {
    const res = await DB.get(id);
    if (!res) return null;

    const todo = get().todos.find((item) => item.id === id);
    if (!todo) return null;

    return { content: res.content, ...todo };
  },

  update_tags: (id, value) => {
    set((state) => {
      state.tags = state.tags.map((item) => (item.id === id ? { ...item, ...value } : item));
    });
  },

  add_tag: (value) => {
    set((state) => {
      state.tags.push({ ...value, id: `tag-${generateLocalID()}`, isHidden: false });
    });
  },

  delete_tag: (id, deleteTodo) => {
    set((state) => {
      state.tags = state.tags.filter((item) => item.id !== id);

      let list = state.todos.map((item) => {
        if (item.tagsId.includes(id)) {
          return deleteTodo ? null : { ...item, tags: item.tagsId.filter((tag) => tag !== id) };
        } else {
          return item;
        }
      });

      state.todos = list.filter((item) => item !== null);
    });
  },

  // ================== 仅用于 /todo 页面 ==================

  tempTodo: defaultTodo,

  update_tempTodo: (value) => {
    set((state) => {
      state.tempTodo = { ...state.tempTodo, ...value };
    });
  },

  change_tempTodo: async (id) => {
    const todo = await get().get_todo(id);
    if (!todo) return;

    // 更改显示内容
    set({
      tempTodo: {
        id: id,
        title: todo.title,
        time: todo.time,
        content: todo.content,
        tagsId: todo.tagsId,
      },
    });

    // 修改编辑器内容
    if (window.editor) {
      window.editor.setEditorState(window.editor.parseEditorState(todo.content));
    }

    // 修改当前选中
    get().update_todos((todos) => todos.map((item) => ({ ...item, isSelected: item.id === id })));
  },

  save_tempTodo: async () => {
    const { tempTodo, update_todo, toggle_AllTodoSelected, update_tempTodo, save_todo } = get();

    if (tempTodo.title === "") return { status: false, msg: "标题不能为空" };

    if (tempTodo.id) {
      const status = await update_todo(tempTodo.id, tempTodo);

      return { status, msg: status ? "更新成功" : "更新失败" };
    } else {
      toggle_AllTodoSelected(false);

      const id = await save_todo(tempTodo);

      if (id) {
        update_tempTodo({ id });

        return { status: true, msg: "保存成功" };
      } else {
        return { status: false, msg: "保存失败" };
      }
    }
  },

  create_tempTodo: async () => {
    const { tempTodo, save_tempTodo, reset_tempTodo, toggle_AllTodoSelected } = get();

    if (tempTodo.id) {
      // 如果当前有未保存的 todo 则先保存
      const { status, msg } = await save_tempTodo();

      if (!status) return { status, msg };
    }

    toggle_AllTodoSelected(false);

    reset_tempTodo();

    return { status: true, msg: "新建成功" };
  },

  toggle_AllTodoSelected: (status) => {
    get().update_todos((todos) =>
      todos.map((item) => {
        return { ...item, isSelected: status };
      }),
    );
  },

  delete_selectedTodo: async () => {
    const { todos, delete_todo } = get();
    const selectedIds = todos.filter((item) => item.isSelected).map((item) => item.id);

    if (selectedIds.length === 0) return { status: false, msg: "未选中任何待办" };

    const status = await delete_todo(selectedIds);

    return { status, msg: status ? "删除成功" : "删除失败" };
  },

  reset_tempTodo: () => {
    get().update_tempTodo(defaultTodo);

    // 初始化编辑器内容
    if (window.editor) {
      window.editor.setEditorState(window.editor.parseEditorState(defaultTodo.content));
    }
  },

  // ================== 仅用于 /board 页面 ==================

  reorder_tags: (sourceId, destinationId) => {
    const list = [...get().tags];

    const sourceIndex = list.findIndex((item) => item.id === sourceId);
    const destinationIndex = list.findIndex((item) => item.id === destinationId);

    const [removed] = list.splice(sourceIndex, 1);
    list.splice(destinationIndex, 0, removed);

    set({ tags: list });
  },

  save_item: (value) => {
    get().save_todo({ ...defaultTodo, ...value });
  },
});
