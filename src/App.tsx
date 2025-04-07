/* eslint-disable unicorn/filename-case */
// I prefer kebab case for filenames, but it's not worth dealing with the git/mac case sensitivity :-)

import { Header } from "./components/header";
import { MediaPlayer } from "./components/media-player";

export const App = (): React.JSX.Element => {
  return (
    <div className="flex min-h-screen w-full flex-col p-4" id="app-container">
      <Header />
      <main className="flex h-full items-center justify-center p-4 md:p-8">
        <MediaPlayer />
      </main>
    </div>
  );
};
