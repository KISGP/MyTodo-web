import ReactDOM from "react-dom";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List, { type ListRowProps } from "react-virtualized/dist/commonjs/List";
import { CSSProperties, memo, useCallback } from "react";
import { Checkbox, Button, cn, Tooltip, Divider } from "@nextui-org/react";
import { DragDropContext, Droppable, Draggable, type DropResult, type DraggableProvided } from "@hello-pangea/dnd";

import useToast from "@/hooks/useToast";
import Trash from "@/assets/svg/trash.svg?react";
import AddIcon from "@/assets/svg/add.svg?react";
import DoOrUndoIcon from "@/assets/svg/doOrUndo.svg?react";
import SelectAllIcon from "@/assets/svg/select-all.svg?react";
import SelectNoIcon from "@/assets/svg/select-no.svg?react";
import FilterIcon from "@/assets/svg/filter.svg?react";
import { useStore, type TodoItemType } from "@/store";

const ListItem = memo<{
  isDragging?: boolean;
  index: number;
  item: TodoItemType;
  style?: CSSProperties;
  provided: DraggableProvided;
  toggleTodoItemSelection?: (index: number, status: boolean) => void;
  changeCurrentTodo?: (index: number) => Promise<void>;
}>(({ item, index, style, provided, isDragging, toggleTodoItemSelection, changeCurrentTodo }) => {
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
          "flex flex-row items-center justify-between overflow-hidden backdrop-blur-sm transition-colors-opacity",
          "bg-default-200/50 hover:bg-default-200 dark:bg-default-300/10 dark:hover:bg-default-300/20",
          isDragging ? "shadow-md" : "",
          item.isSelected ? "!bg-primary-300/30" : "",
        )}
      >
        <div className="flex w-[70%] items-center">
          <Checkbox
            isSelected={item.isSelected}
            onValueChange={(value) => {
              toggleTodoItemSelection!(index, value);
            }}
          />
          <span
            onClick={() => {
              changeCurrentTodo!(index);
            }}
            className="w-full cursor-default select-none truncate text-lg text-default-500"
          >
            {item.title}
          </span>
        </div>

        <div className="min-w-fit select-none text-base text-default-400">
          <span>{item.time}</span>
        </div>
      </div>
      {item.isDone && <Divider className="pointer-events-none absolute top-1/2 w-[calc(100%_-_8px)]" />}
    </div>
  );
});

export default memo(() => {
  const list = useStore((state) => state.todoList);
  const [
    reorderTodoList,
    deleteTodo,
    createTodo,
    changeCurrentTodo,
    toggleTodoItemDone,
    toggleTodoItemSelection,
    toggleAllTodoItemSelection,
  ] = useStore((state) => [
    state.reorderTodoList,
    state.deleteTodo,
    state.createTodo,
    state.changeCurrentTodo,
    state.toggleTodoItemDone,
    state.toggleTodoItemSelection,
    state.toggleAllTodoItemSelection,
  ]);

  const myToast = useToast();

  const onDragEnd = (result: DropResult) => {
    if (result.destination) {
      reorderTodoList(result.source.index, result.destination.index);
    }
  };

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
                index={index}
                provided={provided}
                isDragging={snapshot.isDragging}
                toggleTodoItemSelection={toggleTodoItemSelection}
                changeCurrentTodo={changeCurrentTodo}
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
    <div className="size-full rounded-xl bg-content2 py-2">
      <div className="mb-1 flex h-10 w-full items-center justify-between px-2">
        <span className="ml-1 select-none truncate text-xl font-bold text-foreground/70">清单列表</span>
        <div className="flex gap-2">
          <Tooltip content="筛选">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => {
                myToast("暂未实现", { icon: "🚧" });
              }}
            >
              <FilterIcon className="size-4 fill-default-800/80 dark:fill-default-400/80" />
            </Button>
          </Tooltip>

          <Tooltip content="取消全选">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => {
                toggleAllTodoItemSelection(false);
              }}
            >
              <SelectNoIcon className="size-4 fill-default-800/80 dark:fill-default-400/80" />
            </Button>
          </Tooltip>

          <Tooltip content="全选">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => {
                toggleAllTodoItemSelection(true);
              }}
            >
              <SelectAllIcon className="size-4 fill-default-800/80 dark:fill-default-400/80" />
            </Button>
          </Tooltip>

          <Tooltip content="标记 完成/未完成">
            <Button isIconOnly size="sm" variant="flat" onPress={toggleTodoItemDone}>
              <DoOrUndoIcon className="size-5 fill-default-800/80 dark:fill-default-400/80" />
            </Button>
          </Tooltip>

          <Tooltip content="新建清单">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => {
                createTodo()
                  .then((res) => {
                    myToast(res, { icon: "🎉" });
                  })
                  .catch((error) => {
                    myToast.error(error);
                  });
              }}
            >
              <AddIcon className="size-5 fill-default-800/80 dark:fill-default-400/80" />
            </Button>
          </Tooltip>

          <Tooltip content="删除选中清单">
            <Button isIconOnly size="sm" variant="flat" onPress={() => myToast.promise(deleteTodo())}>
              <Trash className="size-4 fill-default-800/80 dark:fill-default-400/80" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="h-[calc(100%_-_40px)] w-full pl-2">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            mode="virtual"
            droppableId="column"
            renderClone={(provided, snapshot, rubric) => (
              <ListItem
                provided={provided}
                index={rubric.source.index}
                isDragging={snapshot.isDragging}
                item={list[rubric.source.index]}
                style={{ padding: "4px 8px 4px 0" }}
              />
            )}
          >
            {(droppableProvided) => {
              return (
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      width={width}
                      height={height}
                      rowHeight={80}
                      rowCount={list.length}
                      rowRenderer={rowRenderer(list)}
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
