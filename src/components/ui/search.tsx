import { memo } from "react";
import { Input } from "@nextui-org/react";

import Logo from "@/assets/svg/search.svg?react";

const Search = memo(() => {
  return (
    <Input
      isClearable
      disableAnimation
      color="primary"
      radius="lg"
      variant="bordered"
      classNames={{
        base: "w-[360px]",
        input: [
          "bg-transparent",
          "text-black/90 dark:text-white/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
        ],
        innerWrapper: "bg-transparent",
        inputWrapper: [
          "backdrop-blur-xl",
          "!cursor-text",
          "bg-default-300/60",
          "dark:bg-default-200/20",
          "backdrop-blur-xl",
          "backdrop-saturate-200",
          "border-transparent",
          "data-[hover=true]:border-default-400",
          "group-data-[focus=true]:border-primary-300",
          "dark:group-data-[focus=true]:border-primary-500",
          "group-data-[focus=true]:bg-default-200/50",
          "dark:group-data-[focus=true]:bg-default/60",
        ],
      }}
      placeholder="Type to search..."
      startContent={
        <Logo className="pointer-events-none mb-0.5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90" />
      }
    />
  );
});

export default Search;
