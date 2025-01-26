export class Snowflake {
    x: number = 0;
    y: number = 0;
    size: number = 0;
    speed: number = 0;
    wind: number = 0;
    opacity: number = 0;
    swayOffset: number = 0;
    rotation: number = 0;
    rotationSpeed: number = 0;
  
    constructor(canvasHeight: number) {
        this.reset(-Math.random() * canvasHeight);
    }
  
    reset(initialY = -10): void {
        this.x = Math.random() * window.innerWidth;
        this.y = initialY;
        this.size = Math.random() * 2 + 1.5;
        this.speed = Math.random() * 1 + 0.08;
        this.wind = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.4 + 0.4;
        this.swayOffset = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }
  
    update(time: number, heightMap: number[]): void {
        this.x += this.wind + Math.sin(time / 60 + this.swayOffset) * 0.3;
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        const groundHeight = window.innerHeight - heightMap[Math.floor(this.x)];
        
        if (this.y > groundHeight - 5) {
            const impactRange = 20;
            const impact = this.size * 0.5;
            
            for (let i = -impactRange; i <= impactRange; i++) {
                const idx = Math.floor(this.x + i);
                if (idx >= 0 && idx < window.innerWidth) {
                    const distance = Math.abs(i);
                    const factor = Math.pow(1 - distance / impactRange, 2);
                    const heightIncrease = impact * factor * (0.8 + Math.random() * 0.4);
                    
                    const currentHeight = heightMap[idx];
                    const targetHeight = currentHeight + heightIncrease;
                    heightMap[idx] = Math.min(
                        targetHeight,
                        400,
                        ...[-2, -1, 1, 2].map(offset => {
                            const neighborIdx = idx + offset;
                            if (neighborIdx >= 0 && neighborIdx < window.innerWidth) {
                                return heightMap[neighborIdx] + 5;
                            }
                            return targetHeight;
                        })
                    );
                }
            }
            this.reset();
        }
    }
  
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
    
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            ctx.moveTo(0, 0);
            ctx.lineTo(this.size * 1.5, 0);
            ctx.moveTo(this.size * 0.5, 0);
            ctx.lineTo(this.size * 0.8, this.size * 0.3);
            ctx.moveTo(this.size * 0.5, 0);
            ctx.lineTo(this.size * 0.8, -this.size * 0.3);
            ctx.rotate(Math.PI / 3);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = this.size * 0.1;
        ctx.stroke();
        ctx.restore();
    }
}