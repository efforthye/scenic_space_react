import React, { useRef, useEffect } from 'react';
import { ShootingStar, BackgroundStarDrawer } from '../../utils/StarDrawer';

const Stars: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const starDrawerRef = useRef<BackgroundStarDrawer | null>(null);
    const shootingStarsRef = useRef<ShootingStar[]>([]);
    const timeRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        starDrawerRef.current = new BackgroundStarDrawer();
        
        setTimeout(() => {
            shootingStarsRef.current = Array(1).fill(null).map(() => new ShootingStar());
        }, 6000);

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (starDrawerRef.current) {
                starDrawerRef.current.resize();
            }
        };

        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
        timeRef.current++;

        // 배경 그라데이션
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0a0a1e');
        gradient.addColorStop(0.4, '#101B3AFF');
        gradient.addColorStop(1, '#193659FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 배경 별들 그리기
        if (starDrawerRef.current) {
            starDrawerRef.current.draw(ctx, timeRef.current);
        }

        // 별똥별 업데이트 및 그리기
        shootingStarsRef.current.forEach(star => {
            star.update();
            star.draw(ctx);
            if (!star.active && Math.random() < 0.00007) {
                star.reset();
            }
        });

        requestAnimationFrame(animate);
        };

        animate();
        return () => window.removeEventListener('resize', resize);
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default Stars;