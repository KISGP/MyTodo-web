export const tagColors: { [key in string]: string } = {
  green: "border-[#1f883d] bg-[#dafbe1] dark:border-[#238636] dark:bg-[#2ea04326]",
  red: "border-[#cf222e] bg-[#ffebe9] dark:border-[#da3633] dark:bg-[#f851491a]",
  blue: "border-[#0969da] bg-[#ddf4ff] dark:border-[#1f6feb] dark:bg-[#388bfd1a]",
  gray: "border-[#59636e] bg-[#f6f8fa] dark:border-[#9198a1] dark:bg-[#151b23]",
  orange: "border-[#bc4c00] bg-[#fff1e5] dark:border-[#bd561d] dark:bg-[#db6d281a]",
  yellow: "border-[#9a6700] bg-[#fff8c5] dark:border-[#9e6a03] dark:bg-[#bb800926]",
  purple: "border-[#8250df] bg-[#fbefff] dark:border-[#8957e5] dark:bg-[#ab7df826]",
};

export const tags: {
  [key in string]: {
    id: string;
    title: string;
    description: string;
    color: string;
  };
} = {
  Backlog: {
    id: "Backlog",
    title: "Backlog",
    description: "Tasks that are not yet started",
    color: tagColors.green,
  },
  Ready: {
    id: "Ready",
    title: "Ready",
    description: "Tasks that are ready to be worked on",
    color: tagColors.blue,
  },
  InProgress: {
    id: "InProgress",
    title: "In Progress",
    description: "Tasks that are currently being worked on",
    color: tagColors.yellow,
  },
  InReview: {
    id: "InReview",
    title: "In Review",
    description: "Tasks that are ready to be reviewed",
    color: tagColors.purple,
  },
  Done: {
    id: "Done",
    title: "Done",
    description: "Tasks that are completed",
    color: tagColors.orange,
  },
  GiveUp: {
    id: "GiveUp",
    title: "Give Up",
    description: "Tasks that are give up",
    color: tagColors.red,
  },
  NoTag: {
    id: "NoTag",
    title: "No Tag",
    description: "Tasks that are not tagged",
    color: tagColors.gray,
  },
};
