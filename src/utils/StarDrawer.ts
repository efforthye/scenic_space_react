import { BackgroundStar } from '../types/star.types';

export class ShootingStar {
    x: number = 0;
    y: number = 0;
    length: number = 0;
    speed: number = 0;
    angle: number = 0;
    opacity: number = 1;
    active: boolean = true;

    constructor() {
        this.reset();
    }

    reset(): void {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * (window.innerHeight / 3);
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 8 + 5;
        this.angle = Math.PI * 0.75 + (Math.random() * Math.PI / 8);
        this.opacity = 1;
        this.active = true;
    }

    update(): void {
        if (!this.active) return;
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.01;

        if (this.opacity <= 0 || this.y > window.innerHeight || this.x < 0) {
            this.active = false;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        const gradient = ctx.createLinearGradient(
            this.x, this.y,
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

export class BackgroundStarDrawer {
    private stars: BackgroundStar[];

    constructor() {
        this.stars = Array(300).fill(null).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 0.3 + 0.2,
            color: ['#FFF7EBFF', '#FF9E75FF', '#D2E9FFFF', '#FFE2B7FF'][Math.floor(Math.random() * 4)],
            twinkle: Math.random() * Math.PI,
            twinkleSpeed: Math.random() * 0.03 + 0.02
        }));
    }

    resize(): void {
        this.stars = this.stars.map(star => ({
            ...star,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        }));
    }

    draw(ctx: CanvasRenderingContext2D, time: number): void {
        this.stars.forEach(star => {
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkle) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = star.color.replace('1)', `${twinkle * 0.7})`);
            ctx.fill();
        });
    }
}