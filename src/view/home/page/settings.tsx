import { memo, useState } from "react";
import { Tab, Tabs, Select, SelectItem, Selection } from "@nextui-org/react";

import { useStore } from "@/store";

const settings = memo(() => {
  const [notificationScope, update_notificationScope] = useStore((state) => [
    state.notificationScope,
    state.update_notificationScope,
  ]);

  const [value, setValue] = useState<Selection>(new Set([notificationScope.toString()]));

  return (
    <div className="size-full p-4">
      <Tabs size="lg" color="primary" variant="underlined" aria-label="Tabs" classNames={{ tab: "px-16" }}>
        <Tab key="notification" title="通知">
          <div className="px-4 pb-20 pt-10">
            <Select
              label="通知等级"
              className="max-w-xs"
              size="sm"
              selectedKeys={value}
              onSelectionChange={(keys) => {
                const selection = Array.from(keys)[0];
                if (selection) {
                  setValue(keys);
                  update_notificationScope(parseInt(selection.toString()));
                }
              }}
            >
              <SelectItem key="0" description="不通知任何消息">
                0
              </SelectItem>
              <SelectItem key="1" description="仅通知错误消息">
                1
              </SelectItem>
              <SelectItem key="2" description="通知成功和错误消息">
                2
              </SelectItem>
            </Select>
          </div>
        </Tab>
        <Tab key="user" title="账号"></Tab>
      </Tabs>
    </div>
  );
});

export default settings;
