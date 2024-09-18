import ReactDOM from "react-dom";
import List, { type ListRowProps } from "react-virtualized/dist/commonjs/List";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { CSSProperties, memo, useCallback, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DraggableProvided } from "@hello-pangea/dnd";
import {
  Checkbox,
  Button,
  cn,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Selection,
} from "@nextui-org/react";

import Trash from "@/assets/svg/trash.svg?react";
import AddIcon from "@/assets/svg/add.svg?react";
import SelectAllIcon from "@/assets/svg/select-all.svg?react";
import SelectNoIcon from "@/assets/svg/select-no.svg?react";
import FilterIcon from "@/assets/svg/filter.svg?react";
import { useStore, type TodoItemType } from "@/store";
import useToast from "@/hooks/useToast";
import Tag from "./tag";

import { DataSlice } from "@/store";

const ListItem = memo<{
  isDragging?: boolean;
  item: TodoItemType;
  style?: CSSProperties;
  provided: DraggableProvided;
  update_todo: DataSlice["update_todo"];
  change_tempTodo: DataSlice["change_tempTodo"];
}>(({ item, style, provided, isDragging, update_todo, change_tempTodo }) => {
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
          "h-[72px] w-full rounded-xl px-3",
          "flex flex-row items-center justify-between overflow-hidden transition-colors",
          "bg-default-50 hover:bg-default-100 dark:bg-default-100 dark:hover:bg-default-300/50",
          isDragging ? "shadow-md" : "",
          item.isSelected ? "!bg-primary-100" : "",
        )}
      >
        <div className="flex w-[70%] items-center">
          <Checkbox
            isSelected={item.isSelected}
            onValueChange={(value) => update_todo!(item.id, { isSelected: value })}
          />
          <span
            onClick={() => change_tempTodo(item.id)}
            className="w-full cursor-default select-none truncate text-lg text-default-500"
          >
            {item.title}
          </span>
        </div>

        <div className="min-w-fit select-none text-base text-default-400">
          <span>{item.time}</span>
        </div>
      </div>
    </div>
  );
});

export default memo(() => {
  const myToast = useToast();

  const [reorder_todos, delete_selectedTodo, create_tempTodo, change_tempTodo, update_todo, toggle_AllTodoSelected] =
    useStore((state) => [
      state.reorder_todos,
      state.delete_selectedTodo,
      state.create_tempTodo,
      state.change_tempTodo,
      state.update_todo,
      state.toggle_AllTodoSelected,
    ]);

  // 根据标签筛选 todo
  const [list, tags] = useStore((state) => [state.todos, state.tags]);
  const [selectedTags, setSelectedTags] = useState<Selection>(new Set([]));
  const activeList = list.filter((item) => {
    const tag = Array.from(selectedTags)[0];
    return tag ? item.tags.includes(tag as string) : true;
  });

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
          <span className="ml-1 select-none truncate text-xl font-bold text-foreground/70">清单列表</span>
          {tags
            .filter((tag) => tag.id === Array.from(selectedTags)[0])
            .map((tag) => (
              <Tag tag={tag} icon="!size-3" />
            ))}
        </div>
        <div className="flex gap-1">
          <Dropdown classNames={{ content: "min-w-fit" }}>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <FilterIcon className="size-4 fill-default-800/80 dark:fill-default-400/80" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              selectionMode="single"
              selectedKeys={selectedTags}
              onSelectionChange={(keys) => {
                toggle_AllTodoSelected(false);
                setSelectedTags(keys);
              }}
              classNames={{ list: "w-fit" }}
            >
              {tags.map((tag) => (
                <DropdownItem key={tag.id} title={tag.title} startContent={<div className={tag.icon}></div>} />
              ))}
            </DropdownMenu>
          </Dropdown>

          <Tooltip content="取消全选">
            <Button isIconOnly size="sm" variant="light" onPress={() => toggle_AllTodoSelected(false)}>
              <SelectNoIcon className="size-4 fill-default-800/80 dark:fill-default-400/80" />
            </Button>
          </Tooltip>

          <Tooltip content="全选">
            <Button isIconOnly size="sm" variant="light" onPress={() => toggle_AllTodoSelected(true)}>
              <SelectAllIcon className="size-4 fill-default-800/80 dark:fill-default-400/80" />
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
                      rowHeight={80}
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
