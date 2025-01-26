import React, { useEffect, useState } from 'react';
import { BackgroundAudio } from '@/utils/AudioPlayer';
import { SkipBack, SkipForward, Play, Pause, Repeat, Shuffle, ArrowRight } from 'lucide-react';

interface MusicControllerProps {
    audioPlayer: BackgroundAudio;
    onUpdate: () => void;
}

const MusicController: React.FC<MusicControllerProps> = ({ audioPlayer, onUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(audioPlayer.getIsPlaying());
  const [currentTitle, setCurrentTitle] = useState(audioPlayer.getCurrentTrackInfo().title);
  const [playMode, setPlayMode] = useState<'normal' | 'repeat' | 'random'>('normal');
  const iconSize = 12;

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setCurrentTitle(audioPlayer.getCurrentTrackInfo().title);
      setIsPlaying(audioPlayer.getIsPlaying());
    }, 100);
    return () => clearInterval(updateInterval);
  }, [audioPlayer]);

  return (
    <div className="fixed top-3 right-3 z-50">
      <div className="flex flex-col items-center gap-0.5">
        {/* <div style={{ transform: 'scale(0.9)' }} className="text-white/70 text-[10px] text-center w-[80px]">
            {currentTitle}
        </div> */}
        <div className="flex items-center">
          <button 
            onClick={() => { audioPlayer.playPrev(); onUpdate(); }}
            className="bg-transparent text-white/90 hover:text-white">
            <SkipBack size={iconSize} />
          </button>
          <button 
            onClick={() => { audioPlayer.togglePlay(); setIsPlaying(!isPlaying); onUpdate(); }}
            className="bg-transparent text-white/90 hover:text-white">
            {isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
          </button>
          <button 
            onClick={() => { audioPlayer.playNext(); onUpdate(); }}
            className="bg-transparent text-white/90 hover:text-white">
            <SkipForward size={iconSize} />
          </button>
          <button 
            onClick={() => {
              const nextMode = playMode === 'normal' ? 'repeat' : playMode === 'repeat' ? 'random' : 'normal';
              setPlayMode(nextMode);
              if (nextMode === 'repeat') audioPlayer.setRepeatMode('all');
              else if (nextMode === 'random') audioPlayer.toggleRandom();
              else {
                audioPlayer.setRepeatMode('off');
                audioPlayer.toggleRandom();
              }
              onUpdate();
            }}
            className="bg-transparent text-white/90 hover:text-white">
            {playMode === 'repeat' ? <Repeat size={iconSize} /> 
             : playMode === 'random' ? <Shuffle size={iconSize} /> 
             : <ArrowRight size={iconSize} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicController;