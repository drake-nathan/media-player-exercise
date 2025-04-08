import { Button } from "@/components/ui/button";
import { useAudioStore } from "@/hooks/use-audio-store";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

export const PlayControls = (): React.JSX.Element => {
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const togglePlay = useAudioStore((state) => state.togglePlay);
  const skipToNext = useAudioStore((state) => state.skipToNext);
  const skipToPrevious = useAudioStore((state) => state.skipToPrevious);

  return (
    <div className="flex items-center gap-2">
      <Button
        className="h-9 w-9"
        onClick={() => {
          skipToPrevious();
        }}
        size="icon"
        variant="ghost"
      >
        <SkipBack className="h-5 w-5" />
        <span className="sr-only">Previous</span>
      </Button>
      <Button
        className="h-10 w-10 rounded-full"
        onClick={() => {
          togglePlay();
        }}
        size="icon"
        variant="outline"
      >
        {isPlaying ?
          <Pause className="h-5 w-5" />
        : <Play className="ml-0.5 h-5 w-5" />}
        <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
      </Button>
      <Button
        className="h-9 w-9"
        onClick={() => {
          skipToNext();
        }}
        size="icon"
        variant="ghost"
      >
        <SkipForward className="h-5 w-5" />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  );
};
