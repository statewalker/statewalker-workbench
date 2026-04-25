export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`spinner inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ${className}`.trim()}
    />
  );
}
