import { memo } from "react";
import { Calendar } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";

const calendar = memo(() => {
  return (
    <div>
      <I18nProvider locale="zh-CN-u-ca-chinese">
        <Calendar aria-label="Date (International Calendar)" showMonthAndYearPickers />
      </I18nProvider>
    </div>
  );
});

export default calendar;
