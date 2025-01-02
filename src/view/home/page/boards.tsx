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
  DropdownSection,
  Textarea,
} from "@nextui-org/react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

import useToast from "@/hooks/useToast";
import LexicalEditor from "@/components/ui/editor";
import { formatDateString } from "@/lib/utils";
import { parseDate } from "@internationalized/date";
import { Tag, TagCircle, TagSelector } from "@/components/ui/tag";
import { useStore, TagType, TodoItemType } from "@/store";
import { tagColors } from "@/constant";

import AddIcon from "@/assets/svg/add.svg?react";
import TagIcon from "@/assets/svg/tag.svg?react";
import TrashIcon from "@/assets/svg/trash.svg?react";
import EditIcon from "@/assets/svg/edit.svg?react";
import MoreIcon from "@/assets/svg/more.svg?react";
import HiddenIcon from "@/assets/svg/hidden.svg?react";
import CalendarIcon from "@/assets/svg/calendar.svg?react";
import SettingsIcon from "@/assets/svg/settings.svg?react";
import DescriptionIcon from "@/assets/svg/description.svg?react";

type newTagType = (Partial<TagType> | null) & { type: "edit" | "add" };

// Modal 上下文 (用于在拖拽列内的 todo 中打开 Modal)
const ModalContext = createContext<{
  openEditorModal: () => void;
  openCreatorModal: () => void;
  creatorModalData: newTagType;
  setCreatorModalData: (tag: newTagType) => void;
} | null>(null);

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
                    onChange={(date) => {
                      if (date) {
                        const { year, month, day } = date;
                        update_tempTodo({ time: formatDateString(year, month, day) });
                      }
                    }}
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

// Modal 组件 (用于编辑标签)
const CreatorModal = memo<{ isOpen: boolean; onOpenChange: () => void }>(({ isOpen, onOpenChange }) => {
  const { creatorModalData, setCreatorModalData } = useContext(ModalContext)!;

  const [update_tag, add_tag, notificationScope] = useStore((state) => [
    state.update_tag,
    state.add_tag,
    state.notificationScope,
  ]);

  const myToast = useToast(notificationScope);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{`${creatorModalData.type === "edit" ? "修改" : "添加"}标签`}</ModalHeader>
            <ModalBody>
              <div className="w-full overflow-hidden rounded-lg border border-default-100 py-5">
                <Tag
                  tag={{ title: creatorModalData?.title || "text", color: creatorModalData?.color }}
                  classNames={{ base: "mx-auto scale-150" }}
                />
              </div>
              <div className="flex items-center gap-1">
                <span>colors：</span>
                {Object.keys(tagColors).map((key) => (
                  <Button
                    isIconOnly
                    variant="light"
                    key={key}
                    onPress={() => setCreatorModalData({ ...creatorModalData, color: tagColors[key] })}
                  >
                    <TagCircle color={tagColors[key]} />
                  </Button>
                ))}
              </div>
              <Input
                radius="sm"
                variant="flat"
                placeholder="标签标题"
                value={creatorModalData?.title}
                onValueChange={(value) => setCreatorModalData({ ...creatorModalData, title: value.trim() })}
              />
              <Textarea
                radius="sm"
                placeholder="标签描述"
                value={creatorModalData?.description}
                onValueChange={(value) => setCreatorModalData({ ...creatorModalData, description: value.trim() })}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                取消
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  if (creatorModalData?.title && creatorModalData?.color) {
                    if (creatorModalData.type === "edit") {
                      // 修改标签
                      update_tag(creatorModalData.id!, {
                        color: creatorModalData.color,
                        title: creatorModalData.title,
                        description: creatorModalData.description,
                      });
                    } else {
                      // 添加标签
                      add_tag({
                        color: creatorModalData.color,
                        title: creatorModalData.title,
                        description: creatorModalData.description,
                      });
                    }

                    onClose();
                  } else {
                    myToast.error("标题和颜色不能为空", { messagePriority: 1 });
                  }
                }}
              >
                {`${creatorModalData.type === "edit" ? "保存" : "添加"}`}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

// 看板设置
const BoardSettings = memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  const { openCreatorModal, setCreatorModalData } = useContext(ModalContext)!;

  const [tags, update_tags] = useStore((state) => [state.tags, state.update_tags]);

  const selectedTags = new Set(tags.map((item) => !item.isHidden && item.id).filter((v) => Boolean(v)) as string[]);

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen} closeOnSelect={false}>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="flat" className="group absolute right-3 top-3">
          <SettingsIcon className="size-4 fill-default-500 group-hover:fill-primary-500" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        selectionMode="multiple"
        selectedKeys={selectedTags}
        onSelectionChange={(keys) => {
          const selectedKeys = Array.from(keys) as string[];

          // 添加标签
          if (selectedKeys[selectedKeys.length - 1] == "add") {
            setCreatorModalData({ type: "add" });
            openCreatorModal();
            setIsOpen(false);
          }

          // 显示/隐藏 标签
          update_tags((tags) => {
            return tags.map((tag) => {
              if (selectedKeys.includes(tag.id)) {
                return { ...tag, isHidden: false };
              } else {
                return { ...tag, isHidden: true };
              }
            });
          });
        }}
      >
        <DropdownSection showDivider>
          <DropdownItem
            key="add"
            title="添加标签"
            startContent={<AddIcon className="size-4 fill-default-800/80 dark:fill-default-400/80" />}
          />
        </DropdownSection>

        <DropdownSection title="显示/隐藏 标签">
          {tags.map((tag) => (
            <DropdownItem key={tag.id} title={tag.title} startContent={<TagCircle color={tag.color} />} />
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
});

// 拖拽列内的 todo
const Item = memo<{ provided: DraggableProvided; snapshot: DraggableStateSnapshot; item: TodoItemType }>(
  ({ provided, snapshot, item }) => {
    const { openEditorModal } = useContext(ModalContext)!;
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
              openEditorModal();
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

  const { openCreatorModal, setCreatorModalData } = useContext(ModalContext)!;

  const [save_item, update_tag, delete_tag] = useStore((state) => [
    state.save_item,
    state.update_tag,
    state.delete_tag,
  ]);

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
            {columnData.id !== "NoTag" && (
              <Dropdown>
                <DropdownTrigger>
                  <div className="cursor-pointer rounded-lg p-1 hover:bg-default-100">
                    <MoreIcon className="size-6 fill-default-800/80 dark:fill-default-400/80" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu variant="flat" aria-label="TagSettings">
                  <DropdownItem
                    key="edit"
                    title="修改"
                    startContent={<EditIcon className="size-4 fill-default-400" />}
                    onClick={() => {
                      setCreatorModalData({
                        type: "edit",
                        id: columnData.id,
                        color: columnData.color,
                        title: columnData.title,
                        description: columnData.description,
                      });
                      openCreatorModal();
                    }}
                  />
                  <DropdownItem
                    key="new"
                    title="隐藏"
                    startContent={<HiddenIcon className="size-4 fill-default-400" />}
                    onClick={() => update_tag(columnData.id, { isHidden: true })}
                  />
                  <DropdownItem
                    key="delete"
                    title="删除"
                    color="danger"
                    className="text-danger"
                    startContent={<TrashIcon className="size-4 fill-default-400" />}
                    onClick={() => delete_tag(columnData.id, false)}
                  />
                </DropdownMenu>
              </Dropdown>
            )}
          </div>

          {/* 标签描述 */}
          <span className="select-none px-2 text-sm text-default-500/50">{columnData.description}</span>

          {/* todo 列表 */}
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

          {/* 创建 todo */}
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
  const editorModal = useDisclosure();
  const creatorModal = useDisclosure();

  const [creatorModalData, setCreatorModalData] = useState<newTagType>({ type: "add" });

  return (
    <ModalContext.Provider
      value={{
        openEditorModal: editorModal.onOpen,
        openCreatorModal: creatorModal.onOpen,
        creatorModalData,
        setCreatorModalData,
      }}
    >
      {/* 拖拽列 */}
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              // FIXME: react-beautiful-dnd 不支持嵌套滚动，但不影响使用
              className="scrollbar flex size-full overflow-x-auto overflow-y-hidden px-1 py-3 pr-16"
            >
              {boardColumns.map((column, index) => (
                <Column key={column.id} columnData={column} index={index} />
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <BoardSettings />

      <CreatorModal isOpen={creatorModal.isOpen} onOpenChange={creatorModal.onOpenChange} />

      <EditorModal isOpen={editorModal.isOpen} onOpenChange={editorModal.onOpenChange} />
    </ModalContext.Provider>
  );
});

export default Board;
