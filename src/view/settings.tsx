import { memo } from "react";

const settings = memo(() => {
  return <div>settings
    <p>云同步</p>
    <p>列表是分页器还是无限滚动</p>
    <p>主题设置</p>
  </div>;
});

export default settings;
