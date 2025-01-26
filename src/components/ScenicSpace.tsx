import React, { useRef, useEffect, useMemo } from 'react';

// 배경 별들의 속성을 정의하는 인터페이스
interface BackgroundStar {
  x: number;
  y: number;
  size: number;
  color: string;
  twinkle: number;
  twinkleSpeed: number;
}

// 별똥별 클래스 정의
class ShootingStar {
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

  // 별똥별 초기화 및 재설정
  reset(): void {
    // 랜덤한 위치에서 시작하도록 설정
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * (window.innerHeight / 3); // 화면 상단 1/3 영역에서만 생성
    this.length = Math.random() * 80 + 40; // 별똥별 길이
    this.speed = Math.random() * 8 + 5; // 속도 감소
    // 대각선 방향으로 떨어지도록 각도 설정
    this.angle = Math.PI * 0.75 + (Math.random() * Math.PI / 8);
    this.opacity = 1;
    this.active = true;
  }

  // 별똥별 위치 및 상태 업데이트
  update(): void {
    if (!this.active) return;
    
    // 설정된 각도와 속도로 이동
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.opacity -= 0.01; // 투명도 변화 속도 감소

    // 화면 밖으로 나가거나 투명해지면 비활성화
    if (this.opacity <= 0 || this.y > window.innerHeight || this.x < 0) {
      this.active = false;
    }
  }

  // 별똥별 그리기
  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    // 그라데이션 효과 생성
    const gradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x - Math.cos(this.angle) * this.length,
      this.y - Math.sin(this.angle) * this.length
    );
    
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // 별똥별 그리기
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

// 눈송이 클래스 정의
class Snowflake {
  x: number = 0;
  y: number = 0;
  size: number = 0;
  speed: number = 0;
  wind: number = 0;
  opacity: number = 0;
  swayOffset: number = 0;
  rotation: number = 0;
  rotationSpeed: number = 0;
  pattern: number = 0;
  constructor(canvasHeight: number) {
    this.reset(-Math.random() * canvasHeight);
  }

  // 눈송이 초기화 및 재설정
  reset(initialY = -10): void {
    this.x = Math.random() * window.innerWidth;
    this.y = initialY;
    this.size = Math.random() * 2 + 1.5;
    this.speed = Math.random() * 1 + 0.08; // 낙하 속도 감소
    this.wind = Math.random() * 0.4 - 0.2; // 바람 세기 감소
    this.opacity = Math.random() * 0.4 + 0.4;
    this.swayOffset = Math.random() * Math.PI * 2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.pattern = Math.floor(Math.random() * 4);
  }

  // 눈송이 위치 및 상태 업데이트
  update(time: number, heightMap: number[]): void {
    this.x += this.wind + Math.sin(time / 60 + this.swayOffset) * 0.3;
    this.y += this.speed;
    this.rotation += this.rotationSpeed;
    const groundHeight = window.innerHeight - heightMap[Math.floor(this.x)];
    
    // 바닥에 닿았을 때 쌓이는 효과
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

  // 눈송이 그리기
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // 눈송이 패턴 그리기
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

// 메인 애니메이션 컴포넌트
const ScenicSpace: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snowflakes = useRef<Snowflake[]>([]);
  const heightMap = useRef<number[]>([]);
  const shootingStars = useRef<ShootingStar[]>([]);
  const time = useRef<number>(0);
  
  // 배경 별들 생성
  const backgroundStars = useMemo<BackgroundStar[]>(() => Array(300).fill(null).map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 0.3 + 0.2,
    color: ['#FFF7EBFF', '#FF9E75FF', '#D2E9FFFF', '#FFE2B7FF'][Math.floor(Math.random() * 4)],
    twinkle: Math.random() * Math.PI,
    twinkleSpeed: Math.random() * 0.03 + 0.02
  })), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 조정 함수
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      heightMap.current = new Array(window.innerWidth).fill(0);
    };
    resize();
    window.addEventListener('resize', resize);

    // 눈송이와 별똥별 초기화
    snowflakes.current = Array(200).fill(null).map(() => new Snowflake(canvas.height));
    setTimeout(() => {
      shootingStars.current = Array(1).fill(null).map(() => new ShootingStar());
    }, 10000); // 10초 지연

    // 애니메이션 루프
    const animate = () => {
      time.current++;

      // 배경 그라데이션
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a1e');
      gradient.addColorStop(0.4, '#101B3AFF');
      gradient.addColorStop(1, '#193659FF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 배경 별들 그리기
      backgroundStars.forEach(star => {
        const twinkle = Math.sin(time.current * star.twinkleSpeed + star.twinkle) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace('1)', `${twinkle * 0.7})`);
        ctx.fill();
      });

      // 쌓인 눈 그리기
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
    
      // 쌓인 눈 그라데이션
      const snowGradient = ctx.createLinearGradient(0, canvas.height - 400, 0, canvas.height);
      snowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      snowGradient.addColorStop(0.4, 'rgba(240, 245, 255, 0.85)');
      snowGradient.addColorStop(1, 'rgba(230, 240, 255, 0.8)');
      ctx.fillStyle = snowGradient;
      ctx.fill();

      // 쌓인 눈 하이라이트
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x < canvas.width; x += 2) {
        const height = heightMap.current[x];
        ctx.lineTo(x, canvas.height - height);
      }
      ctx.strokeStyle = 'rgba(200, 210, 255, 0.1)';
      ctx.stroke();

      // 눈송이 업데이트 및 그리기
      snowflakes.current.forEach(snowflake => {
        snowflake.update(time.current, heightMap.current);
        snowflake.draw(ctx);
      });

      // 별똥별 업데이트 및 그리기
      shootingStars.current.forEach(star => {
        star.update();
        star.draw(ctx);
        if (!star.active && Math.random() < 0.00007) { // 별똥별 생성 빈도 감소
          star.reset();
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', resize);
  }, [backgroundStars]);

  return (
    <div className="w-full h-screen bg-[#1a1a2e]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ScenicSpace;