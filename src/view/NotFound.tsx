import { memo } from "react";

const NotFound = memo(() => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center dark:text-gray-200/90">
        <h1 className="inline-block text-4xl">404</h1>
        <div className="ml-4 border-l-2 border-solid border-l-gray-950 pl-5 dark:border-l-default-500/80">
          <h2 className="my-1 inline-block text-2xl">Not Found</h2>
          <p className="my-2">Could not find requested page</p>
          <a href="/" className="hover:text-primary-400">
            👉 Return Home
          </a>
        </div>
      </div>
    </div>
  );
});

export default NotFound;
