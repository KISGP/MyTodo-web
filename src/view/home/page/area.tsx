import { memo, useEffect, useRef, createContext, useContext } from "react";
import { createSwapy } from "swapy";
import { parseDate } from "@internationalized/date";
import {
  cn,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DatePicker,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import { TagSelector } from "@/components/ui/tag";
import LexicalEditor from "@/components/ui/editor";

import useToast from "@/hooks/useToast";
import { useStore, PriorityType } from "@/store";
import { formatDateString } from "@/lib/utils";

import TagIcon from "@/assets/svg/tag.svg?react";
import DragIcon from "@/assets/svg/drag.svg?react";
import NoDataIcon from "@/assets/svg/no-data.svg?react";
import CalendarIcon from "@/assets/svg/calendar.svg?react";
import DescriptionIcon from "@/assets/svg/description.svg?react";
import PrioritySelector from "@/components/ui/priority";

// Modal 上下文 (用于打开 Modal)
const ModalContext = createContext<{
  openEditorModal: () => void;
} | null>(null);

// Modal 组件 (用于编辑 todo)
const EditorModal = memo<{ isOpen: boolean; onOpenChange: () => void }>(({ isOpen, onOpenChange }) => {
  const [tempTodo, update_tempTodo, save_tempTodo, id, notificationScope] = useStore((state) => [
    state.tempTodo,
    state.update_tempTodo,
    state.save_tempTodo,
    state.tempTodo.id,
    state.notificationScope,
  ]);

  const myToast = useToast(notificationScope);

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
                  <PrioritySelector
                    placement="bottom-start"
                    defaultPriority={tempTodo.priority}
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

const Quadrant = memo<{ item: PriorityType }>(({ item }) => {
  // 导入 state.tempTodo.priority 以便在修改优先级时更新对应的 todo 所处的象限
  const [todos, change_tempTodo] = useStore((state) => [state.todos, state.change_tempTodo, state.tempTodo.priority]);

  const data = todos.filter((todo) => todo.priority === Number(item.id));

  const { openEditorModal } = useContext(ModalContext)!;

  return (
    <div key={item.id} className="flex-1" data-swapy-slot={item.id}>
      <div
        data-swapy-item={item.id}
        className="group relative size-full overflow-hidden rounded-lg border-2 border-default-200/50 bg-default-50"
      >
        <div className={cn("w-full px-2 py-1 text-lg font-semibold", item.class)}>{`${item.icon} ${item.title}`}</div>

        <div data-swapy-handle className="invisible absolute left-1/2 top-1 -translate-x-1/2 group-hover:visible">
          <DragIcon className="size-4 rotate-90 cursor-grab fill-default-400 active:cursor-grabbing" />
        </div>

        <div className="scrollbar-hidden hover:scrollbar relative size-full overflow-y-auto px-2">
          {data.map((todo) => (
            <div
              key={todo.id}
              className={`my-1 flex w-full items-center justify-between rounded-md border-1 border-transparent bg-content3/30 px-2 py-1 hover:border-default-200`}
              onClick={() => {
                change_tempTodo(todo.id);
                openEditorModal();
              }}
            >
              <span className="text-default-600">{todo.title}</span>
              <span className="text-sm text-default-400">{todo.time}</span>
            </div>
          ))}
        </div>
        {data.length === 0 && (
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
            <NoDataIcon className="size-6 fill-default-400" />
            <i className="text-xs text-default-500">暂无数据</i>
          </div>
        )}
      </div>
    </div>
  );
});

const Area = memo(() => {
  const prioritys = useStore((state) => state.prioritys);

  const containerRef = useRef<HTMLDivElement>(null);

  const editorModal = useDisclosure();

  useEffect(() => {
    const swapy = createSwapy(containerRef.current, {
      swapMode: "hover",
      animation: "dynamic",
    });

    return () => {
      swapy.destroy();
    };
  }, []);

  return (
    <ModalContext.Provider value={{ openEditorModal: editorModal.onOpen }}>
      <div ref={containerRef} className="flex size-full flex-col gap-3 p-2">
        <div className="flex h-1/2 gap-3">
          {prioritys.slice(0, 2).map((item, index) => (
            <Quadrant item={item} key={index} />
          ))}
        </div>
        <div className="flex h-1/2 gap-3">
          {prioritys.slice(2).map((item, index) => (
            <Quadrant item={item} key={index} />
          ))}
        </div>
      </div>
      <EditorModal isOpen={editorModal.isOpen} onOpenChange={editorModal.onOpenChange} />
    </ModalContext.Provider>
  );
});

export default Area;
