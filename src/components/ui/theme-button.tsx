import { memo } from "react";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";

import Theme from "@/assets/svg/theme.svg?react";

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
    <Button isIconOnly onClick={changeTheme}>
      <Theme className="h-6 w-6" />
    </Button>
  );
});

export default ThemeButton;
