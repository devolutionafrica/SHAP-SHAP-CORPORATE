import { Button } from "@/components/ui/button";

export function ButtonOutline({
  children,
  onClick,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}>) {
  return (
    <div className="mt-3 p-2 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        className="text-purple-700 hover:bg-purple-200 p-0"
      >
        {children}
      </Button>
    </div>
  );
}
