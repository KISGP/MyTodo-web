import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createDataSlice, defaultTodo } from "./dataSlice";
import { createUserSlice } from "./userSlice";
import { StoreType } from "./type";

export const useStore = create<StoreType>()(
  devtools(
    immer(
      persist(
        (...args) => ({
          ...createDataSlice(...args),
          ...createUserSlice(...args),
        }),
        {
          name: "Store",
          onRehydrateStorage: () => (state) => {
            // 初始化 todo
            // 有 id 说明是已保存的 todo ，清空
            // TODO: 可以提供设置是否自动保存的选项。现在是对未保存的 todo 提供自动保存的功能。
            // TODO: 可以提供设置是否自动打开上一次打开的 todo 。不清空即可。
            if (state?.tempTodo.id) {
              state.tempTodo = defaultTodo;
            }

            // 初始化 todoList
            if (state?.todos) {
              state.todos = state.todos.map((item) => ({
                ...item,
                isSelected: false,
              }));
            }
          },
        },
      ),
    ),
    {
      name: "Store",
      enabled: true,
    },
  ),
);

export * from "./type";
