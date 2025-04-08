import { Slider } from "@/components/ui/slider";
import { useAudioStore } from "@/hooks/use-audio-store";
import { formatDuration } from "@/lib/format-duration";

export const PlaybackSlider = (): React.JSX.Element => {
  const currentTime = useAudioStore((state) => state.currentTime);
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const duration = useAudioStore((state) => state.duration);
  const seek = useAudioStore((state) => state.seek);

  return (
    <div className="mt-4">
      <Slider
        aria-label="Seek"
        className="[&>span:first-child]:h-1.5"
        max={currentTrack?.duration ?? 100}
        onValueChange={(value) => {
          seek(value[0] ?? 0);
        }}
        step={1}
        value={[currentTime]}
      />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{formatDuration(currentTime)}</span>
        <span>{duration ? formatDuration(duration) : "0:00"}</span>
      </div>
    </div>
  );
};
