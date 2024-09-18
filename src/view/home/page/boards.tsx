import { memo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

import MoreIcon from "@/assets/svg/more.svg?react";
import AddIcon from "@/assets/svg/add.svg?react";
import { cn, Input } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

import { useStore, TagType, TodoItemType } from "@/store";

const Item = memo<{ provided: DraggableProvided; snapshot: DraggableStateSnapshot; item: TodoItemType }>(
  ({ provided, snapshot, item }) => {
    return (
      <div
        ref={provided.innerRef}
        style={provided.draggableProps.style}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={cn(
          "mb-2 min-h-16 select-none text-pretty rounded-lg border-2 border-default-200 bg-content1 p-2 transition-colors dark:border-default-100",
          snapshot.isDragging ? "border-2 !border-primary-300" : "",
        )}
      >
        <span className="break-words">{item.title}</span>
      </div>
    );
  },
);

const Column = memo<{
  index: number;
  columnData: TagType & { items: TodoItemType[] };
}>(({ index, columnData }) => {
  const [inputValue, setInputValue] = useState("");
  const [isCreateItem, setIsCreateItem] = useState(false);
  const [save_item] = useStore((state) => [state.save_item]);

  return (
    <Draggable draggableId={columnData.id} index={index}>
      {(provided) => (
        <div
          key={columnData.id}
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mx-2 flex h-full flex-col rounded-xl border border-default-200 bg-content1 py-2 transition-colors dark:border-default-100"
        >
          <div {...provided.dragHandleProps} className="my-1 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className={columnData.icon}></span>
              <span className="inline-block select-none font-semibold text-default-500">{columnData.title}</span>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <div className="cursor-pointer rounded-lg p-1 hover:bg-default-100">
                  <MoreIcon className="size-6 fill-default-800/80 dark:fill-default-400/80" />
                </div>
              </DropdownTrigger>
              <DropdownMenu variant="flat" aria-label="Dropdown menu">
                <DropdownItem key="new">隐藏</DropdownItem>
                <DropdownItem key="delete" className="text-danger" color="danger">
                  删除
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <span className="select-none px-2 text-sm text-default-500/50">{columnData.description}</span>

          <Droppable droppableId={columnData.id} key={columnData.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="scrollbar-hidden hover:scrollbar my-2 w-72 flex-grow overflow-y-auto px-2"
              >
                {columnData.items.map((item: TodoItemType, index: number) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => <Item provided={provided} snapshot={snapshot} item={item} />}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div
            onClick={() => setIsCreateItem(true)}
            className={cn(
              "mx-2 flex h-9 flex-shrink-0 cursor-pointer items-center gap-3 rounded-lg transition-colors",
              isCreateItem ? "" : "hover:bg-content4/30",
            )}
          >
            {isCreateItem ? (
              <Input
                autoFocus
                size="sm"
                value={inputValue}
                className="flex-grow"
                placeholder="Enter item name"
                onBlur={() => setIsCreateItem(false)}
                onChange={(e) => {
                  setInputValue(e.target.value.trim());
                }}
                onKeyUp={(e) => {
                  if (e.key === "Escape") setIsCreateItem(false);

                  if (e.key === "Enter") {
                    save_item({ title: inputValue, tags: [columnData.id] });

                    setIsCreateItem(false);
                  }
                }}
              />
            ) : (
              <div className="flex cursor-pointer items-center gap-1">
                <AddIcon className="ml-1 size-6 fill-default-400" />
                <span className="select-none text-sm text-default-400">Add Item</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
});

export default function Board() {
  const [tags, todos] = useStore((state) => [state.tags, state.todos]);
  const [update_todo, reorder_tags, reorder_todos] = useStore((state) => [
    state.update_todo,
    state.reorder_tags,
    state.reorder_todos,
  ]);

  const boardColumns = tags.map((column) => ({
    ...column,
    items: todos.filter((item) => item.tags.includes(column.id)),
  }));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (result.type === "COLUMN") {
      reorder_tags(source.index, destination.index);
      return;
    }

    const sourceColumnIndex = boardColumns.findIndex((column) => column.id === source.droppableId);
    const destColumnIndex = boardColumns.findIndex((column) => column.id === destination.droppableId);

    if (source.droppableId == destination.droppableId) {
      // 同列内拖拽(修改 todos 的顺序)
      reorder_todos([
        boardColumns[sourceColumnIndex].items[source.index].id,
        boardColumns[destColumnIndex].items[destination.index].id,
      ]);
    } else {
      // 跨列拖拽(修改 todo 的 tag)
      update_todo(boardColumns[sourceColumnIndex].items[source.index].id, { tags: [boardColumns[destColumnIndex].id] });
    }
  };

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            // FIXME: react-beautiful-dnd 不支持嵌套滚动，但不影响使用
            className="scrollbar flex size-full overflow-x-auto overflow-y-hidden py-3 px-1"
          >
            {boardColumns.map((column, index) => (
              <Column key={column.id} columnData={column} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
