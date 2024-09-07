import { cn } from "@nextui-org/react";

export const toolbarButtonClass = cn(
  "group flex cursor-pointer align-middle outline-none",
  "mr-[2px] gap-1 rounded-lg border-0 p-2",
  "hover:bg-default-200 active:bg-default-300 disabled:cursor-not-allowed",
);

export const toolbarButtonActiveClass = cn("!bg-primary-100/60 dark:!bg-primary-500/30");

export const toolbarIconClass = cn(
  "inline-block bg-contain",
  "mt-[2px] size-[18px] align-[-0.25em] opacity-70",
  "group-active:opacity-100 group-disabled:opacity-20",
);

export const toolbarIconActiveClass = "!opacity-100";

export default {
  code: "editor-code",
  heading: {
    h1: "editor-heading-h1 heading",
    h2: "editor-heading-h2 heading",
    h3: "editor-heading-h3 heading",
    h4: "editor-heading-h4 heading",
    h5: "editor-heading-h5 heading",
    h6: "editor-heading-h6 heading",
  },
  image: "editor-image",
  link: "editor-link",
  list: {
    listitem: "editor-listitem",
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
  },
  ltr: "ltr",
  paragraph: "editor-paragraph",
  placeholder: "editor-placeholder",
  quote: "editor-quote",
  rtl: "rtl",
  text: {
    bold: "editor-text-bold",
    code: "editor-text-code",
    hashtag: "editor-text-hashtag",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    strikethrough: "editor-text-strikethrough",
    underline: "editor-text-underline",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
  },
};
