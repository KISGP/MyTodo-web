import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";

const Avatar = memo(() => {
  const navigate = useNavigate();
  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            size: "sm",
            isBordered: true,
            src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          }}
          className="transition-transform"
          description="@tonyreichert"
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
