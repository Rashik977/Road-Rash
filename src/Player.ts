import { GameObject } from "./GameObject";

export class Player extends GameObject {
  public spriteSheet: HTMLImageElement;
  constructor(x: number, y: number, gameLoop: any) {
    super(x, y);
    this.spriteSheet = new Image();
    this.spriteSheet.src = "characters1.png";
    this.spriteSheet.onload = () => {
      requestAnimationFrame(gameLoop);
    };
  }
}
