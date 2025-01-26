export interface BackgroundStar {
    x: number;
    y: number;
    size: number;
    color: string;
    twinkle: number;
    twinkleSpeed: number;
}
 
export interface Star {
    x: number;
    y: number;
    size: number;
    color: string;
}
 
export interface Constellation {
    stars: Star[];
}