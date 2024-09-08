import { createContext, useState, ReactNode } from "react";

type StyleContextProps = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
};

export const StyleContext = createContext<StyleContextProps | undefined>(undefined);

export const StyleProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return <StyleContext.Provider value={{ isCollapsed, setIsCollapsed }}>{children}</StyleContext.Provider>;
};
