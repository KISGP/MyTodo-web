import { memo, useState, createContext, useContext } from "react";
import {
  cn,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  DatePicker,
} from "@nextui-org/react";
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
import TagIcon from "@/assets/svg/tag.svg?react";
import EditIcon from "@/assets/svg/edit.svg?react";
import DescriptionIcon from "@/assets/svg/description.svg?react";
import { useStore, TagType, TodoItemType } from "@/store";
import { TagCircle, TagSelector } from "@/components/ui/tag";
import LexicalEditor from "@/components/ui/editor";
import { parseDate } from "@internationalized/date";
import { formatDateString } from "@/lib/utils";
import CalendarIcon from "@/assets/svg/calendar.svg?react";

// Modal 上下文 (用于在拖拽列内的 todo 中打开 Modal)
const EditModalContext = createContext<{ onOpen: () => void } | null>(null);

// Modal 组件 (用于编辑 todo)
const EditorModal = memo<{ isOpen: boolean; onOpenChange: () => void }>(({ isOpen, onOpenChange }) => {
  const [tempTodo, update_tempTodo, save_tempTodo] = useStore((state) => [
    state.tempTodo,
    state.update_tempTodo,
    state.save_tempTodo,
  ]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <input
                type="text"
                placeholder="主题"
                className="border-none bg-transparent text-xl outline-none placeholder:text-default-300"
                value={tempTodo.title}
                onChange={(e) => update_tempTodo({ ...tempTodo, title: e.target.value.trim() })}
              />
            </ModalHeader>
            <ModalBody>
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full items-center gap-2">
                  <DescriptionIcon className="size-6 fill-default-500" />
                  <LexicalEditor
                    classNames={{
                      base: "bg-default-100/60 hover:bg-default-100 rounded-lg flex-grow",
                      contentEditable: "max-h-40",
                    }}
                  />
                </div>
                <div className="flex w-full items-center gap-2">
                  <CalendarIcon className="size-6 fill-default-500" />
                  <DatePicker
                    showMonthAndYearPickers
                    size="sm"
                    aria-label="DatePicker"
                    value={parseDate(tempTodo.time)}
                    classNames={{ base: "w-fit" }}
                    dateInputClassNames={{ inputWrapper: "shadow-none" }}
                    onChange={({ year, month, day }) => update_tempTodo({ time: formatDateString(year, month, day) })}
                  />
                </div>
                <div className="flex w-full items-center gap-2">
                  <TagIcon className="size-6 fill-default-400" />
                  <TagSelector
                    placement="bottom-start"
                    tagId={tempTodo.tagsId[0]}
                    onAction={(key) => update_tempTodo({ ...tempTodo, tagsId: [key] })}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  save_tempTodo();
                  onClose();
                }}
              >
                保存
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

// 拖拽列内的 todo
const Item = memo<{ provided: DraggableProvided; snapshot: DraggableStateSnapshot; item: TodoItemType }>(
  ({ provided, snapshot, item }) => {
    const { onOpen } = useContext(EditModalContext)!;
    const [change_tempTodo] = useStore((state) => [state.change_tempTodo]);

    return (
      <div
        ref={provided.innerRef}
        style={provided.draggableProps.style}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={cn(
          "group mb-2 min-h-16 select-none text-pretty rounded-lg border-2 border-default-200 bg-content1 p-2 transition-colors dark:border-default-100",
          snapshot.isDragging ? "z-0 border-2 !border-primary-300 bg-primary-100" : "",
        )}
      >
        <div className="h-16">
          <span className="break-words">{item.title}</span>
        </div>

        <div className="flex flex-row-reverse">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            radius="full"
            className="invisible transition-opacity group-hover:visible"
            onPress={() => {
              // 设置 Modal 显示的数据
              change_tempTodo(item.id);
              // 打开 Modal
              onOpen();
            }}
          >
            <EditIcon className="size-4 fill-default-400" />
          </Button>
        </div>
      </div>
    );
  },
);

// 拖拽列
const Column = memo<{
  index: number;
  columnData: TagType & { items: TodoItemType[] };
}>(({ index, columnData }) => {
  const [inputValue, setInputValue] = useState("");
  const [isCreateItem, setIsCreateItem] = useState(false);
  const [save_item, update_tags] = useStore((state) => [state.save_item, state.update_tags]);

  return (
    <Draggable draggableId={columnData.id} index={index}>
      {(provided, snapshot) => (
        <div
          key={columnData.id}
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "mx-2 flex h-full flex-col rounded-xl border border-default-200 bg-content1 py-2 transition-colors dark:border-default-100",
            snapshot.isDragging ? "border-2 !border-primary-300" : "",
          )}
        >
          <div {...provided.dragHandleProps} className="my-1 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <TagCircle color={columnData.color} />
              <span className="inline-block select-none font-semibold text-default-500">{columnData.title}</span>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <div className="cursor-pointer rounded-lg p-1 hover:bg-default-100">
                  <MoreIcon className="size-6 fill-default-800/80 dark:fill-default-400/80" />
                </div>
              </DropdownTrigger>
              <DropdownMenu variant="flat" aria-label="Dropdown menu">
                <DropdownItem key="new" onClick={() => update_tags(columnData.id, { isHidden: true })}>
                  隐藏
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
                placeholder="输入主题"
                onBlur={() => setIsCreateItem(false)}
                onChange={(e) => {
                  setInputValue(e.target.value.trim());
                }}
                onKeyUp={(e) => {
                  if (e.key === "Escape") setIsCreateItem(false);

                  if (e.key === "Enter") {
                    save_item({ title: inputValue, tagsId: [columnData.id] });
                    setInputValue("");
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

const Board = memo(() => {
  const [tags, todos, update_todo, reorder_tags, reorder_todos] = useStore((state) => [
    state.tags,
    state.todos,
    state.update_todo,
    state.reorder_tags,
    state.reorder_todos,
  ]);

  // 获取标签列
  const boardColumns = tags
    .filter((tag) => !tag.isHidden)
    .map((column) => ({
      ...column,
      items: todos.filter((item) => (column.id === "NoTag" ? !item.tagsId.length : item.tagsId.includes(column.id))),
    }));

  // 拖拽结束事件
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // 拖拽标签列
    if (result.type === "COLUMN") {
      reorder_tags(boardColumns[source.index].id, boardColumns[destination.index].id);
      return;
    }

    // 拖拽标签列内的 todo

    // 获取拖拽的todo所在列的索引
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
      update_todo(boardColumns[sourceColumnIndex].items[source.index].id, {
        tagsId: [boardColumns[destColumnIndex].id],
      });
    }
  };

  // Modal 数据
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <EditModalContext.Provider value={{ onOpen }}>
      {/* 拖拽列 */}
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              // FIXME: react-beautiful-dnd 不支持嵌套滚动，但不影响使用
              className="scrollbar flex size-full overflow-x-auto overflow-y-hidden px-1 py-3"
            >
              {boardColumns.map((column, index) => (
                <Column key={column.id} columnData={column} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <EditorModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </EditModalContext.Provider>
  );
});

export default Board;
