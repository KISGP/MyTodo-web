import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from "@nextui-org/react";

import { useStore } from "@/store";

const Avatar = memo(() => {
  const navigate = useNavigate();

  const [quit] = useStore((state) => [state.quit]);

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            size: "sm",
            isBordered: true,
            src: "https://avatars.githubusercontent.com/u/1725942?v=4",
          }}
          className="transition-transform"
          name="Tony Reichert"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="settings">设置</DropdownItem>
        <DropdownItem key="help_and_feedback">帮助 & 反馈</DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onClick={() => {
            quit();
            navigate("/login", { replace: true });
          }}
        >
          退出登录
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
});

export default Avatar;
