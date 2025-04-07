import { ThemeToggle } from "./theme-toggle";

export const Header = (): React.JSX.Element => {
  return (
    <header className="mb-4 flex justify-between">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold">Linear Media Player</h1>
        <h2 className="text-muted-foreground text-xl font-bold">
          Nathan Drake
        </h2>
      </div>
      <ThemeToggle />
    </header>
  );
};
