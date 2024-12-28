import lunisolar from "lunisolar";
import { formatDateString } from "@/lib/utils";
import { cn } from "@nextui-org/react";
import { memo, useState } from "react";
import { useStore, TodoItemType, TagType } from "@/store";

type DateItem = {
  date: Date;
  lunarDate: string;
  formateDate: string;
  isLastOrNextMonth?: boolean;
  isCurrentDay?: boolean;
  solarTerm?: string;
  todos?: TodoItemType[];
};

const generateMonthCalendar: (date: Date) => Omit<DateItem, "todo">[] = (date) => {
  let dates: DateItem[] = [];

  // 设输入的date为当前日期

  // 获取当前年份
  const currentYear = date.getFullYear();
  // 获取当前月份的天数
  const currentMonth = date.getMonth();
  const currentMonthDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  // 获取当前月份的第一天是星期几
  const currentMonthStartDay = new Date(currentYear, currentMonth, 1).getDay() || 7;
  // 获取上个月的天数
  const lastMonth = new Date(currentYear, currentMonth, 0);
  const lastMonthDays = lastMonth.getDate();

  const format = (t: Date) => formatDateString(t.getFullYear(), t.getMonth() + 1, t.getDate());

  // 填充上个月份的日期
  // 如果每周第一天不是周一，改为 lastMonthDays - currentMonthStartDay + 1
  for (let i = lastMonthDays - currentMonthStartDay + 2; i <= lastMonthDays; i++) {
    const date = new Date(currentYear, currentMonth - 1, i);
    const lunarDate = lunisolar(date);
    dates.push({
      date,
      lunarDate: lunarDate.format("lMlD"),
      formateDate: format(date),
      isLastOrNextMonth: true,
      solarTerm: lunarDate.solarTerm?.toString(),
    });
  }

  // 填充当前月份的日期
  for (let i = 1; i <= currentMonthDays; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const lunarDate = lunisolar(date);
    dates.push({
      date,
      lunarDate: lunarDate.format("lMlD"),
      formateDate: format(date),
      solarTerm: lunarDate.solarTerm?.toString(),
    });
  }

  // 获取需要填充的下个月的天数
  const nextMonthDays = 42 - dates.length;
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(currentYear, currentMonth + 1, i);
    const lunarDate = lunisolar(date);
    dates.push({
      date,
      lunarDate: lunarDate.format("lMlD"),
      formateDate: format(date),
      isLastOrNextMonth: true,
      solarTerm: lunarDate.solarTerm?.toString(),
    });
  }

  if (dates[35].isLastOrNextMonth) {
    dates = dates.slice(0, 35);
  }

  // 标记当前日期
  const currentDay = new Date();
  const currentDayStr = format(currentDay);
  return dates.map((item) => (item.formateDate === currentDayStr ? { ...item, isCurrentDay: true } : item));
};

const DayCard = memo<{ day: DateItem; tags: TagType[] }>(({ day, tags }) => {
  return (
    <div className="group size-full select-none p-1">
      <div
        className={cn(
          "flex items-center justify-between text-lg font-semibold",
          day.isLastOrNextMonth && "brightness-50",
        )}
      >
        {/* 月份日期 */}
        {day.isLastOrNextMonth ? (
          <span className={cn(day.isCurrentDay && "rounded-lg bg-primary-400/90 px-2 dark:bg-primary-400")}>
            {day.date.getMonth() + 1}月{day.date.getDate()}号
          </span>
        ) : (
          <div className={cn("size-8 rounded-full", day.isCurrentDay && "bg-primary-300/90 dark:bg-primary-300")}>
            <p className="size-8 text-center leading-[32px]">{day.date.getDate()}</p>
          </div>
        )}
        {/* 农历 和 节气 */}
        <div className="flex flex-col items-center font-thin text-default-500/80">
          {Boolean(day.solarTerm) ? (
            <>
              <span className="text-xs">{day.lunarDate}</span>
              <span className="text-xs text-primary-400 dark:text-primary-300">{day.solarTerm}</span>
            </>
          ) : (
            <span className="text-sm">{day.lunarDate}</span>
          )}
        </div>
      </div>
      {
        <div className="scrollbar-hidden hover:scrollbar max-h-20 overflow-y-auto">
          {day.todos?.map((todo) => {
            return (
              <div
                key={todo.id}
                className={cn(
                  "my-1 w-full truncate rounded-lg px-2 py-1 text-sm",
                  tags.find((tag) => tag.id === todo.tagsId[0])?.color || "bg-content3/50",
                )}
              >
                <span>{todo.title}</span>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
});

const Calendar = memo(() => {
  const [todos, tags] = useStore((state) => [state.todos, state.tags]);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  let dates = generateMonthCalendar(currentDate);

  dates = dates.map((item) => {
    return {
      ...item,
      todos: todos.filter((todo) => todo.time === item.formateDate),
    } as DateItem;
  });

  return (
    <div className="scrollbar flex size-full flex-col overflow-y-auto p-2">
      <div className="flex h-12 w-full">
        <h2 className="px-2 py-1 text-xl font-semibold">
          {currentDate.toLocaleDateString("default", { month: "long", year: "numeric" })}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((item, index) => (
          <div key={index} className="max-h-fit py-1 text-center text-lg text-default-400">
            {item}
          </div>
        ))}
      </div>
      <div className={`grid flex-grow grid-cols-7 gap-1 grid-rows-${dates.length / 7}`}>
        {dates.map((date) => (
          <div
            key={date.formateDate}
            className="relative overflow-hidden border-t border-default-300 transition-colors"
          >
            <DayCard day={date} tags={tags} />
            {date.isLastOrNextMonth && (
              <div
                className="absolute bottom-0 left-0 right-0 top-0 size-full cursor-pointer backdrop-brightness-75 backdrop-opacity-30 dark:backdrop-opacity-60"
                onClick={() => setCurrentDate(date.date)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default Calendar;
