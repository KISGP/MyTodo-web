import { memo } from "react";
import { Tab, Tabs } from "@nextui-org/react";

import SettingsBoard from "@/components/ui/settings-board";

const settings = memo(() => {
  return (
    <div className="size-full p-4">
      <Tabs size="lg" color="primary" variant="underlined" aria-label="Tabs" classNames={{ tab: "px-16" }}>
       
        <Tab key="board" title="标签">
          <SettingsBoard />
        </Tab> <Tab key="user" title="账号"></Tab>
      </Tabs>
    </div>
  );
});

export default settings;
