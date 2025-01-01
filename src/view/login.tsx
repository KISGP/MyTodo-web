import { memo, useState, Key } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Input, Link, Button, Form } from "@nextui-org/react";

import { useStore } from "@/store";

const login = memo(() => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Key>("login");

  const [loginAsGuest] = useStore((state) => [state.loginAsGuest]);

  const onSubmit = () => {
    loginAsGuest();
    navigate("/", { replace: true });
  };

  return (
    <div className="relative flex h-screen w-screen">
      <div className="flex-grow">
        <img className="size-full object-cover" src={"/bg.jpg"} />
      </div>
      <div className="flex w-[40%] flex-col justify-center bg-content1">
        <div className="mx-auto h-[300px] w-4/5">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected as any}
            onSelectionChange={setSelected}
          >
            <Tab key="login" title="登录">
              <Form className="flex flex-col gap-4" validationBehavior="native" onSubmit={onSubmit}>
                <Input isRequired errorMessage="请输入邮箱" label="邮箱" type="email" />
                <Input isRequired errorMessage="请输入密码" label="密码" type="password" />
                <p className="text-center text-small">
                  需要注册账号?{" "}
                  <Link size="sm" onPress={() => setSelected("sign-up")}>
                    注册
                  </Link>
                </p>
                <div className="flex justify-end gap-2">
                  <Button fullWidth type="submit" color="primary">
                    登录
                  </Button>
                </div>
              </Form>
            </Tab>
            <Tab key="sign-up" title="注册">
              <Form className="flex flex-col gap-4" validationBehavior="native" onSubmit={onSubmit}>
                <Input isRequired errorMessage="请输入邮箱" label="邮箱" type="email" />
                <Input isRequired errorMessage="请输入密码" label="密码" type="password" />
                <p className="text-center text-small">
                  已有账号?{" "}
                  <Link size="sm" onPress={() => setSelected("login")}>
                    登录
                  </Link>
                </p>
                <div className="flex justify-end gap-2">
                  <Button fullWidth color="primary" type="submit">
                    注册
                  </Button>
                </div>
              </Form>
            </Tab>
            <Tab key="guest" title="游客">
              <Button
                color="primary"
                className="mt-16"
                onClick={() => {
                  loginAsGuest();
                  navigate("/", { replace: true });
                }}
              >
                以游客身份登录
              </Button>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
});

export default login;
