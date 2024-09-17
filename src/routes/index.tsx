import { lazy, useEffect } from "react";
import React, { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import { Navigate, useLocation, type RouteObject } from "react-router-dom";

import Home from "@/view/home/index.tsx";
const Todo = lazy(() => import("@/view/home/page/todo"));
const Boards = lazy(() => import("@/view/home/page/boards"));
const Calendar = lazy(() => import("@/view/home/page/calendar"));
const Settings = lazy(() => import("@/view/home/page/settings"));
const Login = lazy(() => import("@/view/login"));
import NotFound from "@/view/NotFound.tsx";

import { useStore } from "@/store";

function Loading({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="absolute left-1/2 top-1/2 size-fit animate-spin">
          <Spinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "todo",
        element: (
          <Loading>
            <Todo />
          </Loading>
        ),
      },
      {
        path: "boards",
        element: (
          <Loading>
            <Boards />
          </Loading>
        ),
      },
      {
        path: "calendar",
        element: (
          <Loading>
            <Calendar />
          </Loading>
        ),
      },
      {
        path: "settings",
        element: (
          <Loading>
            <Settings />
          </Loading>
        ),
      },
      {
        index: true,
        element: <Navigate to="/todo" replace />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Loading>
        <Login />
      </Loading>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export function RouterGuard({ children }: { children: React.ReactNode }) {
  const pathname = useLocation().pathname;
  const [isLogin, reset_tempTodo, toggle_AllTodoSelected] = useStore((state) => [
    state.isLogin,
    state.reset_tempTodo,
    state.toggle_AllTodoSelected,
  ]);

  if (!["/login", "*"].includes(pathname) && !isLogin) {
    return <Navigate to="/login" replace />;
  }

  if (["/login"].includes(pathname) && isLogin) {
    return <Navigate to="/todo" replace />;
  }

  useEffect(() => {
    reset_tempTodo();
    toggle_AllTodoSelected(false);
  }, [pathname]);

  return children;
}

export default routes;
