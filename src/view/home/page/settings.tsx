import { memo } from "react";
import { Tab, Tabs, Switch } from "@nextui-org/react";

const settings = memo(() => {
  return (
    <div className="size-full p-4">
      <Tabs size="lg" color="primary" variant="underlined" aria-label="Tabs" classNames={{ tab: "px-16" }}>
        <Tab key="user" title="账号">
          <div className="scrollbar flex h-[calc(100vh_-_140px)] w-full flex-col overflow-y-auto">
            <div className="flex items-center">
              <span className="mx-10 my-6">自动开启云同步</span>
              <Switch />
            </div>

            {/* <Image width={300} src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg" /> */}
          </div>
        </Tab>
        <Tab key="edit" title="编写" />
        <Tab key="sync" title="同步">
          <div></div>
        </Tab>
      </Tabs>
    </div>
  );
});

export default settings;
