import { memo, useContext } from "react";
import { Outlet } from "react-router-dom";
import { Divider, cn } from "@nextui-org/react";

import { StyleProvider, StyleContext } from "@/context/StyleContext";

import Avatar from "@/components/ui/avatar";
import Search from "@/components/ui/search";
import ThemeButton from "@/components/ui/theme-button";
import Sidebar, { type MenuItemProps } from "@/components/ui/sidebar";
import TodoIcon from "@/assets/svg/todo.svg?react";
import CalendarIcon from "@/assets/svg/calendar.svg?react";
import BoardsIcon from "@/assets/svg/boards.svg?react";

const Menus: MenuItemProps[] = [
  { path: "/", Icon: TodoIcon, title: "待办清单" },
  { path: "/boards", Icon: BoardsIcon, title: "看板" },
  { path: "/calendar", Icon: CalendarIcon, title: "日历" },
];

const Main = memo(() => {
  const { isCollapsed } = useContext(StyleContext)!;

  return (
    <div
      className={cn(
        "flex h-full flex-col transition-width",
        isCollapsed ? "w-[calc(100vw_-_76px)]" : "w-[calc(100vw_-_200px)]",
      )}
    >
      <header className="flex h-[60px] min-h-[60px] items-center justify-between">
        <Search />
        <div className="mx-8 flex h-full min-w-min flex-row-reverse items-center">
          <Avatar />
          <Divider orientation="vertical" className="mx-4 h-[65%]" />
          <ThemeButton />
        </div>
      </header>

      <div className={cn("mr-2 flex-grow overflow-hidden rounded-t-2xl bg-content1")}>
        <Outlet />
      </div>
    </div>
  );
});

const Index = memo(() => {
  return (
    <StyleProvider>
      <div className="relative flex h-screen w-screen bg-base-background">
        <Sidebar menus={Menus} />
        <Main />
      </div>
    </StyleProvider>
  );
});

export default Index;
