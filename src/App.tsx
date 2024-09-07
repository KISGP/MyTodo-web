import { memo, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { isMobile } from "react-device-detect";

import useToast from "@/hooks/useToast";
import routes from "@/routes";

const App = memo(() => {
  const myToast = useToast();

  useEffect(() => {
    isMobile && myToast("请在电脑端打开以获得最佳体验", { icon: "💻" });
  }, []);

  return (
    <>
      {useRoutes(routes)}
      <Toaster />
    </>
  );
});

export default App;
