import { Button } from "@repo/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">Hello World</h1>
      <Button>Click me</Button>
    </div>
  );
}
