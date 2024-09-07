import React, { createContext, memo, useContext, useState } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";

import CollapsedIcon from "@/assets/svg/collapsed.svg?react";
import { cn, Tooltip } from "@nextui-org/react";

export type MenuItemProps = {
  // 跳转路径
  path: string;
  // 菜单标题
  title: string;
  // 菜单图标
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

const MenuItem = memo<MenuItemProps>(({ path, title, Icon }) => {
  const { isCollapsed, navigate } = useContext(SidebarContext);

  return (
    <Tooltip content={title} placement="right">
      <div
        onClick={() => {
          navigate!(path);
        }}
        className="my-1 flex h-12 w-full cursor-pointer select-none items-center gap-2 rounded-lg py-2 transition-colors hover:bg-default-300/50 dark:hover:bg-default-200/40"
      >
        <Icon className={cn("size-5 min-h-5 min-w-5 fill-default-500", isCollapsed ? "mx-4" : "ml-4 mr-1")} />
        {!isCollapsed && <span className="truncate text-default-500">{title}</span>}
      </div>
    </Tooltip>
  );
});

const SidebarContext = createContext<{ isCollapsed: boolean; navigate?: NavigateFunction }>({
  isCollapsed: false,
  navigate: undefined,
});

const Sidebar: React.FC<{ menus: MenuItemProps[] }> = memo(({ menus }) => {
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, navigate }}>
      <div
        id="sidebar"
        className={cn(
          "flex h-full flex-col justify-between px-3 pb-3 transition-width pt-[60px]",
          isCollapsed ? "w-[76px]" : "w-[200px]",
        )}
      >
        <div>
          {menus.map((menu) => (
            <MenuItem key={menu.path} {...menu} />
          ))}
        </div>

        <Tooltip content="折叠" placement="right">
          <div
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              document.getElementById("sidebar")?.offsetWidth;
            }}
            className="my-1 w-full cursor-pointer select-none rounded-lg py-2 transition-colors hover:bg-default-300/50 dark:hover:bg-default-200/40"
          >
            <CollapsedIcon className={cn("size-7 fill-default-500", isCollapsed ? "mx-3" : "ml-3")} />
          </div>
        </Tooltip>
      </div>
    </SidebarContext.Provider>
  );
});

export default Sidebar;
