export class BackgroundAudio {
    public audio: HTMLAudioElement;
    private tracks: Array<{title: string, src: string}>;
    private currentTrack: number = 0;
    private isPlaying: boolean = false;
    private isRandom: boolean = false;
    private repeatMode: 'off' | 'all' = 'off';
    
    constructor() {
        this.audio = new Audio();
        this.tracks = [
            {title: "A Kiss For Amanda", src: '/bgm/A Kiss For Amanda - DJ Williams.mp3'},
            {title: "A Night Alone", src: '/bgm/A Night Alone - TrackTribe.mp3'},
            {title: "Cocktail Hour", src: '/bgm/Cocktail Hour - Aaron Kenny.mp3'},
            {title: "Cover Charge", src: '/bgm/Cover Charge - TrackTribe.mp3'},
            {title: "Jazz Piano Bar", src: '/bgm/Jazz Piano Bar - Doug Maxwell_Media Right Productions.mp3'},
            {title: "No.4 Piano Journey", src: '/bgm/No.4 Piano Journey - Esther Abrami.mp3'},
            {title: "Piano Store", src: '/bgm/Piano Store - Jimmy Fontanez_Media Right Productions.mp3'},
            {title: "Skewls Owt", src: '/bgm/Skewls Owt - Noir Et Blanc Vie.mp3'},
            {title: "Soul and Mind", src: '/bgm/Soul and Mind - E\'s Jammy Jams.mp3'},
            {title: "The Devil's Piano", src: '/bgm/The Devil\'s Piano - Audio Hertz.mp3'},
            {title: "The Gentlemen", src: '/bgm/The Gentlemen - DivKid.mp3'},
            {title: "True Art Real Affection Part 2", src: '/bgm/True Art Real Affection Part 2 - Noir Et Blanc Vie.mp3'},
            {title: "Walk Through the Park", src: '/bgm/Walk Through the Park - TrackTribe.mp3'}
        ].sort(() => Math.random() - 0.5);
        this.audio.src = this.tracks[0].src;
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
    }
    
    private handleTrackEnd = () => {
        if (this.repeatMode === 'all') {
            this.playNext();
        } else if (this.isRandom) {
            this.currentTrack = Math.floor(Math.random() * this.tracks.length);
            this.audio.src = this.tracks[this.currentTrack].src;
            this.audio.play().catch(e => console.error("Audio playback failed:", e));
        } else {
            if (this.currentTrack < this.tracks.length - 1) {
                this.playNext();
            }
        }
    }

    public togglePlay(): void {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play().catch(e => console.error("Audio playback failed:", e));
        }
        this.isPlaying = !this.isPlaying;
    }
    
    public playNext(): void {
        if (this.isRandom) {
            this.currentTrack = Math.floor(Math.random() * this.tracks.length);
        } else {
            this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        }
        this.audio.src = this.tracks[this.currentTrack].src;
        if (this.isPlaying) {
            this.audio.play().catch(e => console.error("Audio playback failed:", e));
        }
    }
    
    public playPrev(): void {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.audio.src = this.tracks[this.currentTrack].src;
        if (this.isPlaying) {
            this.audio.play().catch(e => console.error("Audio playback failed:", e));
        }
    }
    
    public toggleRandom(): void {
        this.isRandom = !this.isRandom;
    }

    public setRepeatMode(mode: 'off' | 'all'): void {
        this.repeatMode = mode;
    }
    
    public getCurrentTrackInfo(): {title: string, index: number} {
        return {
            title: this.tracks[this.currentTrack].title,
            index: this.currentTrack + 1
        };
    }
    
    public isRandomMode(): boolean {
        return this.isRandom;
    }
    
    public getIsPlaying(): boolean {
        return this.isPlaying;
    }
    
    public stop(): void {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
    }
    
}