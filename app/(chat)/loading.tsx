import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner className="animate-spin" size="lg" color="primary" />
    </div>
  );
}
