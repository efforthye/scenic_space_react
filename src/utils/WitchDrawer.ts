import { WitchState, WitchDrawerProps } from '../types/witch.type';

export class WitchDrawer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private image: HTMLImageElement;
    private snowHeightMap: number[];
    private state: WitchState;

    constructor({ canvas, ctx, image, snowHeightMap }: WitchDrawerProps) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.image = image;
        this.snowHeightMap = snowHeightMap;
        
        // 초기 상태 설정
        this.state = {
            position: window.innerWidth,
            moving: false,
            dragging: false,
            dragStartX: 0,
            dragStartY: 0,
            dragStartPosition: {
                x: window.innerWidth,
                y: 0
            },
            dragOffsetX: 0,
            dragOffsetY: 0,
            currentY: 0
        };

        // 이벤트 리스너 설정
        this.setupEventListeners();
    }

    private setupEventListeners() {
        // 마우스 이벤트 핸들러
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    private handleMouseDown = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 마녀 히트박스 계산
        const witchX = Math.floor(this.state.position);
        const witchY = this.state.currentY;
        
        // 마녀 영역 내 클릭 확인 (히트박스 약간 확장)
        if (x >= witchX - 10 && x <= witchX + 61 && y >= witchY - 10 && y <= witchY + 61) {
            this.state.dragging = true;
            this.state.dragStartX = x;
            this.state.dragStartY = y;
            // 드래그 시작할 때의 마녀 위치 저장
            this.state.dragStartPosition = {
                x: this.state.position,
                y: witchY
            };
            this.state.dragOffsetX = x - this.state.position;
            this.state.dragOffsetX = x - this.state.position;
            this.state.dragOffsetY = y - witchY;
            this.state.moving = false; // 드래그 중에는 자동 이동 중지
        }
    };

    private handleMouseMove = (e: MouseEvent) => {
        if (!this.state.dragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 마녀의 새로운 위치 계산 (캔버스 범위 내로 제한)
        this.state.position = Math.max(0, Math.min(x - this.state.dragOffsetX, this.canvas.width - 51));
        this.state.currentY = Math.max(0, Math.min(y - this.state.dragOffsetY, this.canvas.height - 51));
    };

    private handleMouseUp = () => {
        if (this.state.dragging) {
            this.state.dragging = false;
            // 드래그 시작 위치로 마녀 위치 복원
            this.state.position = this.state.dragStartPosition.x;
            this.state.currentY = this.state.dragStartPosition.y;
            this.state.moving = true; // 드래그 종료 후 자동 이동 재개
        }
    };

    public cleanup() {
        // 이벤트 리스너 제거
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }

    // 마녀 상태 업데이트
    public update(avgSnowHeight: number) {
        if (!this.state.dragging) {
        if (!this.state.moving && avgSnowHeight > 8) {
            this.state.moving = true;
        }

        if (this.state.moving) {
            this.state.position -= 2;
            
            // 마녀가 지나간 곳의 눈 녹이기
            for (let i = -14; i <= 14; i++) {
                const idx = Math.floor(this.state.position + i);
                if (idx >= 0 && idx < this.canvas.width) {
                    this.snowHeightMap[idx] = Math.max(this.snowHeightMap[idx] - 3, 0);
                }
            }

            // 화면 끝에 도달하면 리셋
            if (this.state.position < -14) {
                this.state.moving = false;
                this.state.position = this.canvas.width;
            }

            // 눈 위에 있을 때의 Y 위치 계산
            const snowHeight = this.snowHeightMap[Math.floor(this.state.position)] || 0;
            this.state.currentY = this.canvas.height - snowHeight - 51;
        }
        }
    }

    // 마녀 그리기
    public draw() {
        const witchX = Math.floor(this.state.position);
        
        this.ctx.save();
        this.ctx.drawImage(this.image, witchX, this.state.currentY, 51, 51);
        this.ctx.restore();
    }

    // 현재 상태 getter
    public getState(): WitchState {
        return this.state;
    }
}