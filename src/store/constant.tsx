export const tags: {
  [key in string]: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
} = {
  Backlog: {
    id: "Backlog",
    title: "Backlog",
    description: "Tasks that are not yet started",
    icon: "size-4 flex-shrink-0 rounded-full border-2 border-solid border-[#1f883d] bg-[#dafbe1] dark:border-[#238636] dark:bg-[#2ea04326] transition-colors",
  },
  Ready: {
    id: "Ready",
    title: "Ready",
    description: "Tasks that are ready to be worked on",
    icon: "size-4 flex-shrink-0 rounded-full border-2 border-solid border-[#0969da] bg-[#ddf4ff] dark:border-[#1f6feb] dark:bg-[#388bfd1a] transition-colors",
  },
  InProgress: {
    id: "InProgress",
    title: "In Progress",
    description: "Tasks that are currently being worked on",
    icon: "size-4 flex-shrink-0 rounded-full border-2 border-solid border-[#9a6700] bg-[#fff8c5] dark:border-[#9e6a03] dark:bg-[#bb800926] transition-colors",
  },
  InReview: {
    id: "InReview",
    title: "In Review",
    description: "Tasks that are ready to be reviewed",
    icon: "size-4 flex-shrink-0 rounded-full border-2 border-solid border-[#8250df] bg-[#fbefff] dark:border-[#8957e5] dark:bg-[#ab7df826] transition-colors",
  },
  Done: {
    id: "Done",
    title: "Done",
    description: "Tasks that are completed",
    icon: "size-4 flex-shrink-0 rounded-full border-2 border-solid border-[#bc4c00] bg-[#fff1e5] dark:border-[#bd561d] dark:bg-[#db6d281a] transition-colors",
  },
  GiveUp: {
    id: "GiveUp",
    title: "Give Up",
    description: "Tasks that are give up",
    icon: "size-4 flex-shrink-0 rounded-full border-2 border-solid border-[#cf222e] bg-[#ffebe9] dark:border-[#da3633] dark:bg-[#f851491a] transition-colors",
  },
  NoTag: {
    id: "NoTag",
    title: "No Tag",
    description: "Tasks that are not tagged",
    icon: "size-4 flex-shrink-0 rounded-full border-2 border-solid border-[#59636e] bg-[#f6f8fa] dark:border-[#9198a1] dark:bg-[#151b23] transition-colors",
  },
};
