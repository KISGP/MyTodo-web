import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

export type MenuItemProps = {
  // 跳转路径
  path: string;
  // 菜单标题
  title: string;
  // 菜单图标
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

const MenuItem: React.FC<MenuItemProps> = memo(({ path, title, Icon }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(path);
      }}
      className="my-1 flex w-full cursor-pointer select-none items-center gap-2 rounded-lg py-2 transition-colors hover:bg-default-300/50 dark:hover:bg-default-200/40"
    >
      <Icon className="ml-5 mr-1 h-5 w-5 fill-default-500" />
      <span className="text-sm dark:text-default-500">{title}</span>
    </div>
  );
});

const Menu: React.FC<{ menus: MenuItemProps[] }> = memo(({ menus }) => {
  return (
    <>
      {menus.map((menu) => (
        <MenuItem key={menu.path} {...menu} />
      ))}
    </>
  );
});

export default Menu;
