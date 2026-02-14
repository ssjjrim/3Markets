export default function LoadingCard() {
  return (
    <div className="bg-bg-card border border-border-primary rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="skeleton w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="skeleton h-8 flex-1 rounded-lg" />
        <div className="skeleton h-8 flex-1 rounded-lg" />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-20" />
      </div>
    </div>
  );
}
