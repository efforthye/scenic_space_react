import { useEffect, useRef } from "react";
import { BackgroundStarDrawer, ShootingStar } from "@/utils/StarDrawer";
import { Snowflake } from "@/utils/SnowDrawer";
import catImage from "/public/girl.png";

const ScenicSpace: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starDrawerRef = useRef<BackgroundStarDrawer | null>(null);
  const snowflakes = useRef<Snowflake[]>([]);
  const shootingStars = useRef<ShootingStar[]>([]);
  const heightMap = useRef<number[]>([]);
  const time = useRef<number>(0);
  const isFirstStar = useRef<boolean>(true);
  const firstStarDelay = useRef<number>(0);

  const catPosition = useRef(window.innerWidth);
  const catMoving = useRef(false);
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

    starDrawerRef.current = new BackgroundStarDrawer();
    snowflakes.current = Array(200).fill(null).map(() => new Snowflake(canvas.height));
    shootingStars.current = Array(1).fill(null).map(() => {
      const star = new ShootingStar();
      star.active = false; // 처음에는 비활성 상태로 시작
      return star;
    });

    // 마녀 이미지 로드
    const cat = new Image();
    cat.src = `${catImage}?${new Date().getTime()}`; // 캐시 방지로 GIF 움직임 보장
    cat.onload = () => {
      console.log("마녀 GIF 로드 완료");
      catImageRef.current = cat;
    };
    cat.onerror = () => {
      console.error("마녀 GIF 로드 실패:", cat.src);
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
            if (firstStarDelay.current >= 60*13) { // 60fps * 13초
              star.reset();
              isFirstStar.current = false;
            }
          } else if (Math.random() < 0.001) { // 0007
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

      // 평균 눈 높이 계산 및 마녀 이동 시작 조건
      const avgSnowHeight = Math.round(totalSnow / canvas.width);
      if (!catMoving.current && avgSnowHeight > 8) {
        catMoving.current = true;
      }

      // 마녀 이동 및 눈 녹이기
      if (catMoving.current && catImageRef.current) {
        const catX = Math.floor(catPosition.current);
        const snowHeight = heightMap.current[catX] || 0;

        ctx.save();
        const catY = canvas.height - snowHeight - 51; // 눈 높이에 맞춰 마녀 배치, 위치 조정
        ctx.drawImage(catImageRef.current, catX, catY, 51, 51); // 크기를 51x51으로 조정
        ctx.restore();

        catPosition.current -= 3; // 마녀 왼쪽으로 이동

        // 마녀가 지나간 곳의 눈 녹이기 (범위 14픽셀로 확대)
        for (let i = -14; i <= 14; i++) {
          const idx = Math.floor(catPosition.current + i);
          if (idx >= 0 && idx < window.innerWidth) {
            heightMap.current[idx] = Math.max(heightMap.current[idx] - 3, 0);
          }
        }

        if (catPosition.current < -14) {
          catMoving.current = false;
          catPosition.current = window.innerWidth; // 마녀 위치 초기화
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default ScenicSpace;