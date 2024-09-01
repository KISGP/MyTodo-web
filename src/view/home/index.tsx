import { memo } from "react";
import { Outlet } from "react-router-dom";
import { Divider } from "@nextui-org/react";

import Avatar from "@/components/ui/avatar";
import Search from "@/components/ui/search";
import ThemeButton from "@/components/ui/theme-button";
import Menu, { type MenuItemProps } from "@/components/ui/menu";
import TodoIcon from "@/assets/svg/todo.svg?react";
import CalendarIcon from "@/assets/svg/calendar.svg?react";
import BoardsIcon from "@/assets/svg/boards.svg?react";

const Menus: MenuItemProps[] = [
  { path: "/", Icon: TodoIcon, title: "待办清单" },
  { path: "/boards", Icon: BoardsIcon, title: "看板" },
  { path: "/calendar", Icon: CalendarIcon, title: "日历" },
];

const index = memo(() => {
  return (
    <div className="relative flex h-screen w-screen flex-col bg-base-background">
      {/* 头部（搜索框 用户头像） */}
      <header className="flex h-[60px] w-screen flex-row-reverse items-center justify-between pl-[200px] pr-4">
        <div className="mx-8 flex h-full min-w-min flex-row-reverse items-center">
          <Avatar />
          <Divider orientation="vertical" className="mx-4 h-[65%]" />
          <ThemeButton />
        </div>
        <Search />
      </header>

      <main className="flex size-full flex-row">
        <div id="sidebar" className="h-full w-[200px] min-w-[200px] px-3">
          <Menu menus={Menus} />
        </div>

        <div className="mr-2 flex-grow rounded-tl-2xl rounded-tr-2xl bg-content1 pl-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
});

export default index;
