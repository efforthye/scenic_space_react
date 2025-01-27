export interface WitchState {
    position: number;
    moving: boolean;
    dragging: boolean;
    dragStartX: number;
    dragStartY: number;
    dragStartPosition: {
      x: number;
      y: number;
    };
    dragOffsetX: number;
    dragOffsetY: number;
    currentY: number;
}
  
export interface WitchDrawerProps {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    image: HTMLImageElement;
    snowHeightMap: number[];
}