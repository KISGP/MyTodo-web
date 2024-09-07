import { lazy } from "react";
import React, { memo, Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import { Navigate, type RouteObject } from "react-router-dom";

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

const Loading = memo<{ children: React.ReactNode }>(({ children }) => {
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
});

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

export default routes;
