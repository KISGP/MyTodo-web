import { memo } from "react";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";

import Lunar from "@/assets/svg/lunar.svg?react";
import Sun from "@/assets/svg/sun.svg?react";

const ThemeButton = memo(() => {
  const { theme, setTheme } = useTheme();
  const changeTheme = () => {
    if (theme == "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  return (
    <Button isIconOnly size="sm" radius="full" variant="light" onClick={changeTheme}>
      {theme == "light" ? <Lunar className="size-6 fill-default-500" /> : <Sun className="size-6 fill-default-500" />}
    </Button>
  );
});

export default ThemeButton;
