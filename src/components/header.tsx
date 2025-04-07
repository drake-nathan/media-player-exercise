import { ThemeToggle } from "./theme-toggle";

export const Header = (): React.JSX.Element => {
  return (
    <header className="flex justify-between p-4">
      <div className="grid gap-1">
        <h1 className="text-xl font-bold md:text-3xl">Linear Media Player</h1>
        <h2 className="text-muted-foreground text-lg font-bold md:text-xl">
          Nathan Drake
        </h2>
      </div>
      <ThemeToggle />
    </header>
  );
};
