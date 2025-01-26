import { BackgroundAudio } from "@/utils/AudioPlayer";

export interface AudioNote {
    note: number;
    duration: number;
}
  
export interface MelodyProps {
    notes: AudioNote[];
    volume: number;
    tempo: number;
}

export interface MusicControllerProps {
    audioPlayer: BackgroundAudio;
    onUpdate: () => void;
}