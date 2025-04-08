import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioStore } from "@/hooks/use-audio-store";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

export const VolumeControls = (): React.JSX.Element => {
  const volume = useAudioStore((state) => state.volume);
  const changeVolume = useAudioStore((state) => state.changeVolume);

  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    changeVolume(value[0] ?? 0);

    if (value[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    changeVolume(isMuted ? 80 : 0);
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-1 items-center justify-end gap-2">
      <Button
        className="h-9 w-9"
        onClick={toggleMute}
        size="icon"
        variant="ghost"
      >
        {isMuted || volume === 0 ?
          <VolumeX className="h-5 w-5" />
        : <Volume2 className="h-5 w-5" />}
        <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
      </Button>
      <div className="w-24">
        <Slider
          aria-label="Volume"
          max={1}
          onValueChange={handleVolumeChange}
          step={0.01}
          value={[isMuted ? 0 : volume]}
        />
      </div>
    </div>
  );
};
