import { memo, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { isMobile } from "react-device-detect";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import useToast from "@/hooks/useToast";
import routes, { RouterGuard } from "@/routes";

import "@/styles/index.css";

const App = memo(() => {
  const myToast = useToast();

  useEffect(() => {
    isMobile && myToast("请在电脑端打开以获得最佳体验", { icon: "💻" });
  }, []);

  return (
    <RouterGuard>
      {useRoutes(routes)}
      <Toaster />
    </RouterGuard>
  );
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <NextUIProvider>
      <NextThemesProvider attribute="class" themes={["light", "dark"]} defaultTheme="light" enableSystem={false}>
        <App />
      </NextThemesProvider>
    </NextUIProvider>
  </BrowserRouter>,
);
