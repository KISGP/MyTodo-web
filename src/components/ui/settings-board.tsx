import { memo, useCallback, useState } from "react";
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";

import { TagType, useStore } from "@/store";
import { tagColors } from "@/constant";
import Tag, { TagIcon } from "./tag";
import useToast from "@/hooks/useToast";

const TagItem = memo<{ tag: TagType }>(({ tag }) => {
  const [iseEdited, setIsEdited] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [update_tags, delete_tag] = useStore((state) => [state.update_tags, state.delete_tag]);

  const [color, setColor] = useState(tag.color);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const save = useCallback(() => {
    if (iseEdited) {
      update_tags(tag.id, {
        color,
        title: title ? title : tag.title,
        description: description ? description : tag.description,
      });
    }
    setIsEdited(!iseEdited);
  }, [iseEdited, color, title, description]);

  return (
    <div className="flex min-h-28 items-center justify-between rounded-xl p-5 transition-colors odd:bg-default-100/50">
      <div className="flex w-1/2 items-center gap-4">
        {iseEdited ? (
          <>
            <Dropdown classNames={{ content: "min-w-fit" }}>
              <DropdownTrigger>
                <Button variant="flat" isIconOnly>
                  <TagIcon color={color} className="size-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="tag colors" onAction={(key) => setColor(tagColors[key])}>
                {Object.keys(tagColors).map((key) => (
                  <DropdownItem key={key} title={key} startContent={<TagIcon color={tagColors[key]} />} />
                ))}
              </DropdownMenu>
            </Dropdown>

            <div className="flex flex-grow flex-col gap-2">
              <Input
                size="sm"
                placeholder={"标题：" + tag.title}
                value={title}
                onValueChange={(value) => setTitle(value)}
                onKeyUp={(e) => e.key === "Enter" && save()}
              />
              <Input
                size="sm"
                placeholder={"描述：" + tag.description}
                value={description}
                onValueChange={(value) => setDescription(value.trim())}
                onKeyUp={(e) => e.key === "Enter" && save()}
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-10">
              <TagIcon color={tag.color} className="mx-auto size-5" />
            </div>
            <div className="flex flex-grow flex-col gap-2 py-[6px] transition-colors">
              <span className="text-xl text-default-600">{tag.title}</span>
              <span className="text-base text-default-400">{tag.description}</span>
            </div>
          </>
        )}
      </div>

      <div>
        <Button
          variant="light"
          className="mx-2"
          color={tag.isHidden ? "success" : "default"}
          onPress={() => update_tags(tag.id, { isHidden: !tag.isHidden })}
        >
          {tag.isHidden ? "显示" : "隐藏"}
        </Button>
        <Button variant="light" className="mx-2" color={iseEdited ? "primary" : "default"} onPress={save}>
          {iseEdited ? "保存" : "编辑"}
        </Button>
        <Button variant="light" className="mx-2" color="danger" onPress={onOpen}>
          删除
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">删除方式</ModalHeader>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    取消
                  </Button>
                  <Button
                    color="warning"
                    variant="light"
                    onPress={() => {
                      delete_tag(tag.id, false);
                      onClose();
                    }}
                  >
                    仅删除标签
                  </Button>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      delete_tag(tag.id, true);
                      onClose();
                    }}
                  >
                    删除 {tag.title} 标签下的所有待办
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
});

const SettingsBoard = memo(() => {
  const [tags, add_tag] = useStore((state) => [state.tags, state.add_tag]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newColor, setNewColor] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const myToast = useToast();

  return (
    <div className="scrollbar h-[calc(100vh_-_135px)] overflow-y-auto px-4 pb-20 pt-10">
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
      <Divider className="my-5" />
      <Button variant="light" color="primary" fullWidth onPress={onOpen}>
        <span className="text-xl font-semibold">添加标签</span>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">添加标签</ModalHeader>
              <ModalBody>
                <div className="w-full overflow-hidden rounded-lg border border-default-100 py-5">
                  <Tag
                    tag={{ title: newTitle || "text", color: newColor }}
                    classNames={{ base: "mx-auto scale-150" }}
                  />
                </div>

                <div className="flex items-center gap-1">
                  <span>colors：</span>
                  {Object.keys(tagColors).map((key) => (
                    <Button variant="light" isIconOnly onPress={() => setNewColor(tagColors[key])}>
                      <TagIcon color={tagColors[key]} />
                    </Button>
                  ))}
                </div>
                <Input
                  radius="sm"
                  variant="flat"
                  placeholder="标签标题"
                  value={newTitle}
                  onValueChange={(value) => setNewTitle(value.trim())}
                />
                <Textarea
                  radius="sm"
                  placeholder="标签描述"
                  value={newDescription}
                  onValueChange={(value) => setNewDescription(value.trim())}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (newTitle) {
                      add_tag({ color: newColor, title: newTitle, description: newDescription });
                      setNewColor("");
                      setNewTitle("");
                      setNewDescription("");
                      onClose();
                    } else {
                      myToast.error("标签标题不能为空");
                    }
                  }}
                >
                  添加
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
});

export default SettingsBoard;
