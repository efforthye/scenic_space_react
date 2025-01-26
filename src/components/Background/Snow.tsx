import React, { useRef, useEffect } from 'react';
import { Snowflake } from '../../utils/SnowDrawer';

const Snow: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const snowflakes = useRef<Snowflake[]>([]);
    const heightMap = useRef<number[]>([]);
    const time = useRef<number>(0);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            heightMap.current = new Array(window.innerWidth).fill(0);
        };
        resize();
        window.addEventListener('resize', resize);

        snowflakes.current = Array(200).fill(null).map(() => new Snowflake(canvas.height));

        const animate = () => {
            time.current++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            
            for (let i = 0; i < canvas.width; i += 2) {
                let height = 0;
                for (let ii = -5; ii <= 5; ii++) {
                    const idx = i + ii;
                    if (idx >= 0 && idx < canvas.width) {
                        const weight = 1 - Math.abs(ii) / 6;
                        height += heightMap.current[idx] * weight;
                    }
                }
                height = height / 5;
                ctx.lineTo(i, canvas.height - height);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();
          
            const snowGradient = ctx.createLinearGradient(0, canvas.height - 400, 0, canvas.height);
            snowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            snowGradient.addColorStop(0.4, 'rgba(240, 245, 255, 0.85)');
            snowGradient.addColorStop(1, 'rgba(230, 240, 255, 0.8)');
            ctx.fillStyle = snowGradient;
            ctx.fill();

            if (time.current % 30 === 0) {
                snowflakes.current.push(new Snowflake(canvas.height));
            }

            snowflakes.current.forEach((snowflake, index) => {
                snowflake.update(time.current, heightMap.current);
                snowflake.draw(ctx);

                if (snowflake.y > canvas.height) {
                    snowflakes.current.splice(index, 1);
                }
            });

            requestAnimationFrame(animate);
        };

        animate();
        return () => window.removeEventListener('resize', resize);
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default Snow;