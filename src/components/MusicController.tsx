import React, { useEffect, useState } from 'react';
import { BackgroundAudio } from '@/utils/AudioPlayer';
import { SkipBack, SkipForward, Play, Pause, Repeat, Repeat1, Shuffle, ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface MusicControllerProps {
    audioPlayer: BackgroundAudio;
    onUpdate: () => void;
}

const MusicController: React.FC<MusicControllerProps> = ({ audioPlayer, onUpdate }) => {
    const [isPlaying, setIsPlaying] = useState(audioPlayer.getIsPlaying());
    const [currentTitle, setCurrentTitle] = useState(audioPlayer.getCurrentTrackInfo().title);
    const [playMode, setPlayMode] = useState<'normal' | 'repeat-one' | 'repeat-all' | 'random'>('normal');
    const [volume, setVolume] = useState(100);
    const [showVolume, setShowVolume] = useState(false);
    const iconSize = 12;

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setCurrentTitle(audioPlayer.getCurrentTrackInfo().title);
            setIsPlaying(audioPlayer.getIsPlaying());
        }, 100);
        return () => clearInterval(updateInterval);
    }, [audioPlayer]);

    useEffect(() => {
        if (audioPlayer.audio) {
            audioPlayer.audio.volume = volume / 100;
        }
    }, [volume]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.volume-control-container')) {
                setShowVolume(false);
            }
        };

        if (showVolume) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showVolume]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
    };

    const toggleVolumeBar = () => {
        setShowVolume(!showVolume);
    };

    const getVolumeIcon = () => {
        if (volume === 0) return <VolumeX size={iconSize} />;
        return <Volume2 size={iconSize} />;
    };

    return (
        <div className="fixed top-3 left-3 z-50">
            <div className="volume-control-container flex flex-col items-start gap-1">
                {/* <div style={{ transform: 'scale(0.9)' }} className="text-white/70 text-[10px] text-center w-[80px]">
                    {currentTitle}
                </div> */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleVolumeBar}
                        className="bg-transparent text-white/90 hover:text-white p-1"
                    >
                        {getVolumeIcon()}
                    </button>
                    <button 
                        onClick={() => { audioPlayer.playPrev(); onUpdate(); }}
                        className="bg-transparent text-white/90 hover:text-white p-1"
                    >
                        <SkipBack size={iconSize} />
                    </button>
                    <button 
                        onClick={() => { audioPlayer.togglePlay(); setIsPlaying(!isPlaying); onUpdate(); }}
                        className="bg-transparent text-white/90 hover:text-white p-1"
                    >
                        {isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
                    </button>
                    <button 
                        onClick={() => { audioPlayer.playNext(); onUpdate(); }}
                        className="bg-transparent text-white/90 hover:text-white p-1"
                    >
                        <SkipForward size={iconSize} />
                    </button>
                    <button 
                        onClick={() => {
                            const nextMode = playMode === 'normal' ? 'repeat-all' 
                                       : playMode === 'repeat-all' ? 'repeat-one'
                                       : playMode === 'repeat-one' ? 'random' 
                                       : 'normal';
                            setPlayMode(nextMode);
                            if (nextMode === 'repeat-one') audioPlayer.setRepeatMode('one');
                            else if (nextMode === 'repeat-all') audioPlayer.setRepeatMode('all');
                            else if (nextMode === 'random') {
                                audioPlayer.setRepeatMode('all');
                                audioPlayer.toggleRandom();
                            }
                            else {
                                audioPlayer.setRepeatMode('off');
                                audioPlayer.toggleRandom();
                            }
                            onUpdate();
                        }}
                        className="bg-transparent text-white/90 hover:text-white p-1"
                    >
                        {playMode === 'repeat-all' ? <Repeat size={iconSize} />
                         : playMode === 'repeat-one' ? <Repeat1 size={iconSize} />
                         : playMode === 'random' ? <Shuffle size={iconSize} /> 
                         : <ArrowRight size={iconSize} />}
                    </button>
                </div>
                {showVolume && (
                    <div className="px-1">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full h-1 appearance-none bg-white/30 rounded-full outline-none cursor-pointer"
                            style={{
                                backgroundImage: `linear-gradient(to right, white ${volume}%, rgba(255,255,255,0.3) ${volume}%)`,
                                width: '180px'
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicController;