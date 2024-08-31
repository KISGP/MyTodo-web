import { memo } from "react";
import { useRoutes } from "react-router-dom";

import routes from "@/routes";

const index = memo(() => {
  return <>{useRoutes(routes)}</>;
});

export default index;
