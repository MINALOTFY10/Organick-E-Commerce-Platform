import clsx from "clsx";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-[#2a4d42]",
        className
      )}
    />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={clsx("h-4 w-full", className)} />;
}

export function SkeletonCard({ className, children }: React.PropsWithChildren<SkeletonProps>) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-[#2a4d42] bg-[#2a4d42] p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
