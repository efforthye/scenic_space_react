import { useEffect, useRef } from "react";
import { BackgroundStarDrawer, ShootingStar } from "@/utils/StarDrawer";
import { Snowflake } from "@/utils/SnowDrawer";
import { WitchDrawer } from "@/utils/WitchDrawer";
import catImage from "/public/girl.png";

const ScenicSpace: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starDrawerRef = useRef<BackgroundStarDrawer | null>(null);
  const witchDrawerRef = useRef<WitchDrawer | null>(null);
  const snowflakes = useRef<Snowflake[]>([]);
  const shootingStars = useRef<ShootingStar[]>([]);
  const heightMap = useRef<number[]>([]);
  const time = useRef<number>(0);
  const isFirstStar = useRef<boolean>(true);
  const firstStarDelay = useRef<number>(0);
  const catImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    heightMap.current = new Array(window.innerWidth).fill(0);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      heightMap.current = new Array(window.innerWidth).fill(0);
      if (starDrawerRef.current) {
        starDrawerRef.current.resize();
      }
    };

    window.addEventListener('resize', resize);

    // 초기화
    starDrawerRef.current = new BackgroundStarDrawer();
    snowflakes.current = Array(200).fill(null).map(() => new Snowflake(canvas.height));
    shootingStars.current = Array(1).fill(null).map(() => {
      const star = new ShootingStar();
      star.active = false;
      return star;
    });

    // 마녀 이미지 로드
    const cat = new Image();
    cat.src = `${catImage}?${new Date().getTime()}`;
    cat.onload = () => {
      catImageRef.current = cat;
      // 이미지 로드 완료 후 WitchDrawer 초기화
      if (catImageRef.current) {
        witchDrawerRef.current = new WitchDrawer({
          canvas,
          ctx,
          image: catImageRef.current,
          snowHeightMap: heightMap.current
        });
      }
    };

    const animate = () => {
      time.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 배경 그리기
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a1e');
      gradient.addColorStop(0.4, '#101B3AFF');
      gradient.addColorStop(1, '#193659FF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 별 그리기
      if (starDrawerRef.current) {
        starDrawerRef.current.draw(ctx, time.current);
      }

      // 유성 업데이트 및 그리기
      shootingStars.current.forEach(star => {
        star.update();
        star.draw(ctx);
        
        if (!star.active) {
          if (isFirstStar.current) {
            firstStarDelay.current++;
            if (firstStarDelay.current >= 60*13) {
              star.reset();
              isFirstStar.current = false;
            }
          } else if (Math.random() < 0.001) {
            star.reset();
          }
        }
      });

      // 눈 내리기
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

      // 눈이 쌓이는 부분
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      let totalSnow = 0;
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
        totalSnow += height;
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

      // 마녀 업데이트 및 그리기
      if (witchDrawerRef.current) {
        const avgSnowHeight = Math.round(totalSnow / canvas.width);
        witchDrawerRef.current.update(avgSnowHeight);
        witchDrawerRef.current.draw();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (witchDrawerRef.current) {
        witchDrawerRef.current.cleanup();
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default ScenicSpace;