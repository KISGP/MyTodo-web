import { lazy } from "react";
import React, { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import { Navigate, useLocation, type RouteObject } from "react-router-dom";

import Home from "@/view/home/index.tsx";

const Todo = lazy(() => import("@/view/home/page/todo"));

import Calendar from "@/view/home/page/calendar";

import Boards from "@/view/home/page/boards";
// const User = lazy(() => import("@/view/home/user.tsx"));
import User from "@/view/home/page/user";
// const Login = lazy(() => import("@/view/login.tsx"));
import Login from "@/view/login.tsx";
// const NotFound = lazy(() => import("@/view/NotFound.tsx"));
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
        path: "/user/:id",
        element: (
          <Loading>
            <User />
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
  const isLogin = useStore((state) => state.isLogin);

  if (!["/login", "*"].includes(pathname) && !isLogin) {
    return <Navigate to="/login" replace />;
  }

  if (["/login"].includes(pathname) && isLogin) {
    return <Navigate to="/todo" replace />;
  }

  return children;
}

export default routes;
