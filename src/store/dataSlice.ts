import IndexedDBHelper from "@/lib/indexedDB";
import { generateLocalID } from "@/lib/utils";
import { parseDate } from "@internationalized/date";
import { DataStateType } from "./type";

const DB = new IndexedDBHelper();

export const defaultTodo = {
  id: "",
  title: "",
  time: new Date().toISOString().slice(0, 10),
  content:
    '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
};

export const createDataSlice: DataStateType = (set, get) => ({
  todo: defaultTodo,

  todoList: [],

  saveTodo: async () => {
    const todo = get().todo;

    // 标题是必需的
    if (todo.title === "") {
      return Promise.reject("标题不能为空");
    }

    // 通过 todo.id 判断是否是新的 todo，并进行更新或新建
    // 更新
    if (todo.id) {
      set((state) => {
        const index = state.todoList.findIndex((item) => item.id === todo.id);
        state.todoList[index].time = todo.time;
        state.todoList[index].title = todo.title;
      });

      // 更新 indexedDB

      try {
        return await DB.update(todo);
      } catch (error) {
        return Promise.reject(String(error));
      }
    } else {
      // 新建

      // 添加一些新的状态
      const newTodo = {
        ...todo,
        id: generateLocalID(),
        isCloudSynced: false,
        isSelected: true,
        isDone: false,
        uid: get().user.uid,
      };

      try {
        const msg = await DB.add(newTodo);

        // 取消当前所有选中
        get().toggleAllTodoItemSelection(false);

        // 添加到 todoList 和 更新 todo
        set((state) => {
          state.todo = newTodo;
          state.todoList.unshift({
            ...newTodo,
            isSelected: true,
            isDone: false,
          });
        });

        return msg;
      } catch (error) {
        return Promise.reject(String(error));
      }
    }
  },

  saveTodo_title: (title) => {
    set((state) => {
      state.todo.title = title.replace(/\s*/g, "");
    });
  },

  saveTodo_time: (ISOtime) => {
    set((state) => {
      state.todo.time = ISOtime;
    });
  },

  getTodo_time: () => {
    const time = get().todo?.time;
    if (time) {
      return parseDate(time);
    } else {
      return undefined;
    }
  },

  editorId: generateLocalID(),

  isAllowContentChanged: false,

  toggleIsAllowContentChanged: (status) => {
    set((state) => {
      state.isAllowContentChanged = status;
    });
  },

  saveTodo_content: (serializedEditorState) => {
    set((state) => {
      state.todo.content = serializedEditorState;
    });
  },

  clearTodo_content: () => {
    // 通过修改 LexicalComposer 的 key 使之重新渲染，以此来清空编辑器内容
    set((state) => {
      state.editorId = generateLocalID();
    });
  },

  createTodo: async () => {
    const { todo, saveTodo, clearTodo_content, toggleAllTodoItemSelection } = get();

    // 如果当前 todo 有 title 但没有 id 则认为是未保存的 todo
    if (!todo.id && todo.title) {
      return Promise.reject("请先保存当前待办");
    }

    if (todo.id) {
      if (todo.title) {
        // 保存当前 todo, 防止丢失
        await saveTodo();
      } else {
        return Promise.reject("标题不能为空");
      }
    }

    // 清空编辑器内容
    clearTodo_content();

    // 取消当前所有选中
    toggleAllTodoItemSelection(false);

    // 初始化 todo 数据
    set({ todo: defaultTodo });

    return "新建成功";
  },

  deleteTodo: async () => {
    const todoList = get().todoList;

    try {
      const newTodoList = await Promise.all(
        todoList.map((item) => {
          return (async () => {
            if (!item.isSelected) return item;

            await DB.delete(item.id);

            return null;
          })();
        }),
      );

      set({ todoList: newTodoList.filter((item) => item !== null) });

      return "删除成功";
    } catch (error) {
      return Promise.reject(String(error));
    }
  },

  toggleTodoItemDone: async () => {
    const todoList = get().todoList;

    const newTodoList = await Promise.all(
      todoList.map((item) => {
        return (async () => {
          if (!item.isSelected) return item;

          // 更新 indexedDB
          await DB.update({ id: item.id, isDone: !item.isDone });

          return { ...item, isDone: !item.isDone };
        })();
      }),
    );

    set({ todoList: newTodoList });
  },

  reorderTodoList: (sourceIndex, destinationIndex) => {
    if (sourceIndex === destinationIndex) return;

    // 创建副本
    const list = [...get().todoList];

    // 对副本进行修改
    const [removed] = list.splice(sourceIndex, 1);
    list.splice(destinationIndex, 0, removed);

    // 更新状态
    set({ todoList: list });
  },

  toggleTodoItemSelection: (index, status) => {
    // const list = [...get().todoList];
    set((state) => {
      state.todoList[index].isSelected = status;
    });
  },

  toggleAllTodoItemSelection: (status) => {
    set((state) => {
      state.todoList.forEach((item) => {
        item.isSelected = status;
      });
    });
  },

  changeCurrentTodo: async (index) => {
    // 判断当前是否有多个选中的
    if (get().todoList.filter((item) => item.isSelected).length > 1) return;

    const data = await DB.get(get().todoList[index].id);

    if (!data) return;
    set((state) => {
      state.isAllowContentChanged = true;
      state.todo = { ...data, content: data.content };
    });
  },
});
