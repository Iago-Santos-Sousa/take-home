import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex flex-col gap-3">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}
