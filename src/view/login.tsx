import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";

import EyeFilledIcon from "@/assets/svg/eye-filled.svg?react";
import EyeSlashFilledIcon from "@/assets/svg/eye-slash-filled.svg?react";

const login = memo(() => {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="relative h-screen w-screen">
      <img
        className="size-full"
        src={"https://w.wallhaven.cc/full/d6/wallhaven-d6y12l.jpg"}
      />
      <div className="absolute right-0 top-0 z-10 flex h-full w-1/3 flex-col items-center justify-center rounded-l-xl bg-content1">
        <div className="flex w-3/5 flex-col items-center gap-4">
          <Input size="lg" type="email" label="Email" variant="faded" />
          <Input
            size="lg"
            label="Password"
            variant="faded"
            type={isVisible ? "text" : "password"}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
          />
          <Button color="primary" variant="solid" className="mb-6 w-full">
            登录 / 注册
          </Button>
          <span className="w-full cursor-pointer px-2 text-sm text-primary-300 hover:text-primary-500 dark:text-primary-500 dark:hover:text-primary-400">
            忘记密码
          </span>
          <span
            onClick={() => {
              navigate("/", { replace: true });
            }}
            className="w-full cursor-pointer px-2 text-sm text-primary-300 hover:text-primary-500 dark:text-primary-500 dark:hover:text-primary-400"
          >
            游客登录
          </span>
        </div>
      </div>
    </div>
  );
});

export default login;
