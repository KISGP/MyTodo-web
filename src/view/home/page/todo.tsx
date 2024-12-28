import ReactDOM from "react-dom";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List, { type ListRowProps } from "react-virtualized/dist/commonjs/List";
import { memo, useEffect, useState, CSSProperties, useCallback } from "react";
import { Checkbox, Button, cn, Tooltip, Divider } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useShallow } from "zustand/react/shallow";
import { Panel, PanelGroup, PanelResizeHandle, getPanelGroupElement } from "react-resizable-panels";
import { DragDropContext, Droppable, Draggable, type DraggableProvided } from "@hello-pangea/dnd";

import useToast from "@/hooks/useToast";
import LexicalEditor from "@/components/ui/editor";
import TodoFilter from "@/components/ui/todo-filter";
import { throttle, formatDateString } from "@/lib/utils";
import { useStore, type TodoItemType, type DataSlice } from "@/store";
import { TagSelector, Tag } from "@/components/ui/tag";
import { PrioritySelector, Priority } from "@/components/ui/priority";

import DragIcon from "@/assets/svg/drag.svg?react";
import Trash from "@/assets/svg/trash.svg?react";
import AddIcon from "@/assets/svg/add.svg?react";
import CompleteIcon from "@/assets/svg/complete.svg?react";

const TodoEditor = memo(() => {
  const [notificationScope, id, time, save_tempTodo, update_tempTodo] = useStore((state) => [
    state.notificationScope,
    state.tempTodo.id,
    state.tempTodo.time,
    state.save_tempTodo,
    state.update_tempTodo,
  ]);

  const [title, tagsId] = useStore(useShallow((state) => [state.tempTodo.title, state.tempTodo.tagsId]));

  const myToast = useToast(notificationScope);

  return (
    <div id="editorContainer" className="relative size-full">
      <div className="mb-2 flex h-16 w-full items-center justify-between gap-16 rounded-xl border border-default-200 px-2 py-2 transition-colors dark:border-default-100">
        <input
          id="todo-title-input"
          type="text"
          placeholder="主题"
          value={title || ""}
          className="h-3/4 flex-grow rounded-lg bg-transparent px-4 text-2xl font-semibold caret-default-500 outline-none placeholder:text-default-300"
          onChange={(e) => update_tempTodo({ title: e.target.value })}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            e.key === "Enter" && myToast.auto(save_tempTodo());
          }}
        />
        <DatePicker
          showMonthAndYearPickers
          aria-label="DatePicker"
          value={parseDate(time)}
          classNames={{ base: "w-fit" }}
          dateInputClassNames={{ inputWrapper: "shadow-none" }}
          onChange={({ year, month, day }) => update_tempTodo({ time: formatDateString(year, month, day) })}
        />
      </div>
      <div className="relative w-full rounded-xl border border-default-200 py-2 text-left text-base font-normal transition-colors dark:border-default-100 dark:text-default-500/80">
        <LexicalEditor toolbar action classNames={{ contentEditable: "h-[calc(100vh_-_252px)]" }} />
        <div className="flex items-center gap-2 px-2">
          <PrioritySelector
            onAction={(key) => {
              update_tempTodo({ priority: key });
              id &&
                save_tempTodo().then(({ status }) => {
                  if (status) {
                    myToast.success("更新优先级成功", { messagePriority: 2 });
                  } else {
                    myToast.error("更新优先级失败", { messagePriority: 1 });
                  }
                });
            }}
          />
          <TagSelector
            showDescription
            placement="top-start"
            tagId={tagsId[0]}
            onAction={(key) => {
              update_tempTodo({ tagsId: [key] });
              id &&
                save_tempTodo().then(({ status }) => {
                  if (status) {
                    myToast.success("更新标签成功", { messagePriority: 2 });
                  } else {
                    myToast.error("更新标签失败", { messagePriority: 1 });
                  }
                });
            }}
          />
        </div>
      </div>
    </div>
  );
});

const ListItem = memo<{
  isDragging?: boolean;
  item: TodoItemType;
  style?: CSSProperties;
  provided: DraggableProvided;
  update_todo: DataSlice["update_todo"];
  change_tempTodo: DataSlice["change_tempTodo"];
  tagStyle?: string;
}>(({ item, style, provided, isDragging, update_todo, change_tempTodo, tagStyle }) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        ...style,
        ...provided.draggableProps.style,
      }}
    >
      <div
        className={cn(
          "h-16 w-full rounded-lg px-3",
          "flex flex-row items-center justify-between border transition-colors",
          "border-default-200 bg-default-50 hover:bg-default-100 dark:border-transparent dark:bg-default-100 dark:hover:bg-default-300/50",
          isDragging ? "shadow-md" : "",
          item.isSelected ? "!bg-primary-100" : "",
        )}
      >
        <div className={`absolute left-0 h-10 w-0 rounded-md border-2 ${tagStyle ?? "border-default-300"}`}></div>
        <div className="flex w-[70%] items-center">
          <Checkbox
            isSelected={item.isSelected}
            onValueChange={(value) => update_todo!(item.id, { isSelected: value })}
          />
          <p
            onClick={() => change_tempTodo(item.id)}
            className="w-full cursor-default select-none truncate text-lg text-default-500"
          >
            <span className="relative px-2">
              {item.isCompleted ? <i className="text-base">{item.title}</i> : item.title}
              <Divider className={cn("absolute top-1/2 bg-default-500", !item.isCompleted && "invisible")} />
            </span>
          </p>
        </div>

        <div className="min-w-fit select-none text-base text-default-400">
          <span>{item.time}</span>
        </div>
      </div>
    </div>
  );
});

const TodoList = memo(() => {
  const [
    notificationScope,
    reorder_todos,
    delete_selectedTodo,
    create_tempTodo,
    change_tempTodo,
    update_todo,
    toggle_AllTodoSelected,
    toggle_todoCompleted,
  ] = useStore((state) => [
    state.notificationScope,
    state.reorder_todos,
    state.delete_selectedTodo,
    state.create_tempTodo,
    state.change_tempTodo,
    state.update_todo,
    state.toggle_AllTodoSelected,
    state.toggle_todoCompleted,
  ]);

  const myToast = useToast(notificationScope);

  // 根据标签筛选 todo
  const [list, tags, prioritys] = useStore((state) => [state.todos, state.tags, state.prioritys]);
  const [filter, setFilter] = useState<{ type: string; id: string } | null>(null);
  const activeList = list.filter((item) => {
    if (!filter) return true;

    if (filter.type === "priority") {
      return item.priority === parseInt(filter.id);
    } else {
      return item.tagsId.includes(filter.id);
    }
  });

  let filterTip = null;
  if (filter) {
    if (filter.type === "priority") {
      filterTip = <Priority priority={prioritys.find((item) => item.id === parseInt(filter.id))} />;
    }
    if (filter.type === "tag") {
      filterTip = <Tag tag={tags.find((item) => item.id === filter.id)!} classNames={{ icon: "size-3" }} />;
    }
  }

  const rowRenderer = useCallback(
    (todoList: TodoItemType[]) =>
      ({ index, style }: ListRowProps) => {
        const item = todoList[index];

        if (!item) return null;

        return (
          <Draggable index={index} key={item.id} draggableId={item.id}>
            {(provided, snapshot) => (
              <ListItem
                item={item}
                provided={provided}
                isDragging={snapshot.isDragging}
                update_todo={update_todo}
                change_tempTodo={change_tempTodo}
                tagStyle={tags.find((tag) => tag.id === item.tagsId[0])?.color}
                style={{
                  ...style,
                  padding: "4px 8px 4px 0",
                }}
              />
            )}
          </Draggable>
        );
      },
    [],
  );

  return (
    <div className="size-full rounded-xl border border-default-200 py-2 transition-colors dark:border-default-100">
      <div className="mb-1 flex h-10 w-full items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div>
            <Checkbox onValueChange={(value) => toggle_AllTodoSelected(value)} />
            <span className="ml-1 select-none truncate text-xl font-bold text-foreground/70">清单列表</span>
          </div>
          {filterTip}
        </div>
        <div className="flex gap-1">
          <TodoFilter
            onAction={(res) => {
              toggle_AllTodoSelected(false);
              setFilter(res);
            }}
          />

          <Tooltip content="完成/未完成">
            <Button isIconOnly size="sm" variant="light" onPress={toggle_todoCompleted}>
              <CompleteIcon className="size-5 fill-default-800/80 dark:fill-default-400/80" />
            </Button>
          </Tooltip>

          <Tooltip content="新建清单">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => {
                myToast.auto(create_tempTodo());

                document.getElementById("todo-title-input")?.focus();
              }}
            >
              <AddIcon className="size-5 fill-default-800/80 dark:fill-default-400/80" />
            </Button>
          </Tooltip>

          <Tooltip content="删除选中清单">
            <Button isIconOnly size="sm" variant="light" onPress={() => myToast.auto(delete_selectedTodo())}>
              <Trash className="size-4 fill-default-800/80 dark:fill-default-400/80" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="h-[calc(100%_-_40px)] w-full pl-2">
        <DragDropContext
          onDragEnd={(result) => result.destination && reorder_todos([result.source.index, result.destination.index])}
        >
          <Droppable
            mode="virtual"
            droppableId="column"
            renderClone={(provided, snapshot, rubric) => (
              <ListItem
                provided={provided}
                isDragging={snapshot.isDragging}
                item={list[rubric.source.index]}
                style={{ padding: "4px 8px 4px 0" }}
                update_todo={update_todo}
                change_tempTodo={change_tempTodo}
                tagStyle={tags.find((tag) => tag.id === list[rubric.source.index].tagsId[0])?.color}
              />
            )}
          >
            {(droppableProvided) => {
              return (
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      className="scrollbar-hidden hover:scrollbar"
                      width={width}
                      height={height}
                      rowHeight={72}
                      rowCount={activeList.length}
                      rowRenderer={rowRenderer(activeList)}
                      ref={(ref) => {
                        if (ref) {
                          // eslint-disable-next-line react/no-find-dom-node
                          const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                          if (whatHasMyLifeComeTo instanceof window.HTMLElement) {
                            droppableProvided.innerRef(whatHasMyLifeComeTo);
                          }
                        }
                      }}
                    />
                  )}
                </AutoSizer>
              );
            }}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
});

const todo = memo(() => {
  const [listMinWidth, setListMinWidth] = useState<number>(40);
  const [editorMinWidth, setEditorMinWidth] = useState<number>(60);

  // 更新编辑器最大宽度
  useEffect(() => {
    const groupElement = getPanelGroupElement("group");

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        if (entry.target === groupElement) {
          if (groupElement!.offsetWidth > 1150) {
            const listMinWidth = (300 / groupElement!.offsetWidth) * 100;
            const editorMinWidth = (750 / groupElement!.offsetWidth) * 100;

            setListMinWidth(listMinWidth);
            setEditorMinWidth(editorMinWidth);
          }
        }
      }
    };

    const resizeObserver = new ResizeObserver(throttle(handleResize, 1000));

    resizeObserver.observe(groupElement!);

    // 清除事件监听器
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <PanelGroup id="group" direction="horizontal">
      <Panel id="left" minSize={listMinWidth} className="mb-1 ml-2 mr-1 mt-2">
        <TodoList />
      </Panel>
      <PanelResizeHandle className="relative">
        <DragIcon className="absolute -left-2 top-1/2 size-4 fill-default-500/50"></DragIcon>
      </PanelResizeHandle>
      <Panel id="right" minSize={editorMinWidth} className="ml-1 mr-2 mt-2">
        <TodoEditor />
      </Panel>
    </PanelGroup>
  );
});

export default todo;
