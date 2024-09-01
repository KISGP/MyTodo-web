// import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

// import Loading from "@/components/ui/loading";

import Home from "@/view/home/index.tsx";
// const Todo = lazy(() => import("@/view/home/todo.tsx"));
import Todo from "@/view/home/todo.tsx";
// const Calendar = lazy(() => import("@/view/home/calendar.tsx"));
import Calendar from "@/view/home/calendar.tsx";

import Boards from "@/view/home/boards.tsx";
// const User = lazy(() => import("@/view/home/user.tsx"));
import User from "@/view/home/user.tsx";
// const Login = lazy(() => import("@/view/login.tsx"));
import Login from "@/view/login.tsx";
// const NotFound = lazy(() => import("@/view/NotFound.tsx"));
import NotFound from "@/view/NotFound.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "todo",
        element: (
          // <Loading>
          <Todo />
          // </Loading>
        ),
      },
      {
        path: "boards",
        element: (
          // <Loading>
          <Boards />
          // </Loading>
        ),
      },
      {
        path: "calendar",
        element: (
          // <Loading>
          <Calendar />
          // </Loading>
        ),
      },
      {
        path: "/user/:id",
        element: (
          // <Loading>
          <User />
          // </Loading>
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
      // <Loading>
      <Login />
      // </Loading>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
