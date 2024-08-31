import { memo, Suspense } from "react";
import Loading from "@/assets/svg/loading.svg?react";

const loading = memo((props: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="absolute left-1/2 top-1/2 size-fit animate-spin">
          <Loading className="h-7 w-7 fill-primary-500" />
        </div>
      }
    >
      {props.children}
    </Suspense>
  );
});

export default loading;
