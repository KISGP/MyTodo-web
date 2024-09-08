import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import MoreIcon from "@/assets/svg/more.svg?react";
import AddIcon from "@/assets/svg/add.svg?react";
import { cn } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

const tasks = new Array(50).fill(0).map((_, index) => ({
  id: index.toString(),
  content: `Task ${index}`,
}));

const taskStatus = {
  done: {
    name: "Done",
    items: tasks.slice(15, 50),
  },
  backlog: {
    name: "Backlog",
    items: tasks.slice(0, 5),
  },
  ready: {
    name: "Requested",
    items: tasks.slice(5, 10),
  },
  inProgress: {
    name: "In Progress",
    items: [],
  },
  inReview: {
    name: "In Review",
    items: tasks.slice(10, 15),
  },

  a: {
    name: "Test",
    items: [],
  },
};

const onDragEnd = (result: any, columns: any, setColumns: any) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

export default function Board() {
  const [columns, setColumns] = useState(taskStatus);

  return (
    <div className="scrollbar flex size-full justify-between gap-6 overflow-y-hidden overflow-x-scroll p-3 transition-colors">
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div
              className="flex h-full flex-col rounded-xl border border-default-200/60 bg-content1 py-2"
              key={columnId}
            >
              <div className="my-1 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="size-4 flex-shrink-0 rounded-full border-2 border-solid border-[#1f883d] bg-[#dafbe1] dark:border-[#238636] dark:bg-[#2ea04326]"></div>
                  <span className="select-none font-semibold text-default-500">{column.name}</span>
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

              <Droppable droppableId={columnId} key={columnId}>
                {(provided) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="scrollbar my-2 w-72 flex-grow overflow-y-auto px-2"
                    >
                      {column.items.map((item, index) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => {
                              return (
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  style={provided.draggableProps.style}
                                  className={cn(
                                    "mb-2 min-h-16 select-none rounded-lg border border-default-200 bg-content2/50 p-2",
                                    snapshot.isDragging ? "border-2 border-primary-300" : "",
                                  )}
                                >
                                  <span className="text-default-700">{item.content}</span>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>

              <div className="flex h-9 flex-shrink-0 cursor-pointer items-center gap-3 rounded-lg px-2 hover:bg-content4/30">
                <AddIcon className="ml-1 size-6 fill-default-400" />
                <span className="select-none text-default-400">Add Item</span>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
