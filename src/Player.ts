import { GameObject } from "./GameObject";
import { Global } from "./Global";
import { Sprite } from "./Sprite";

export class Player extends GameObject {
  private frameWidth: number; // Width of a single frame
  private frameHeight: number; // Height of a single frame
  private totalFrames: number; // Total number of frames in the animation
  private currentFrame: number; // Index of the current frame
  private frameSpeed: number; // Speed of frame change in milliseconds
  private direction: string; // Possible values: 'right', 'left'
  private speed: number;
  private lastAnimationFrameTime: number | null;

  private sourceX: number;
  private sourceY: number;
  private playerScale: number;
  constructor(x: number, y: number) {
    super(x, y);
    this.frameWidth = 37;
    this.frameHeight = 37;
    this.totalFrames = 3;
    this.currentFrame = 0;
    this.frameSpeed = 200;
    this.direction = "right";
    this.lastAnimationFrameTime = null;
    this.speed = 0.05;

    this.sourceY = 0; // Assuming all frames are in a single row
    this.playerScale = 1.5; // Scale the player sprite
  }

  playerUpdate(deltaTime: number, keys: any) {
    let dx = 0;
    let dy = 0;

    if (keys.left) {
      dx -= 1;
      this.direction = "left";
    }
    if (keys.right) {
      dx += 1;
      this.direction = "right";
    }
    if (keys.up) {
      dy -= 1;
    }
    if (keys.down) {
      dy += 1;
    }

    // Normalize the movement to ensure consistent speed in all directions
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
      dx = (dx / length) * this.speed * deltaTime;
      dy = (dy / length) * this.speed * deltaTime;
    }

    this.X += dx;
    this.Y += dy;
  }

  playerAnimationUpdate(timestamp: number, isMoving: boolean) {
    if (!this.lastAnimationFrameTime) {
      this.lastAnimationFrameTime = timestamp;
    }

    if (isMoving) {
      //
      const animationDeltaTime = timestamp - this.lastAnimationFrameTime;
      if (animationDeltaTime > this.frameSpeed) {
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        this.lastAnimationFrameTime = timestamp;
      }
    } else {
      this.currentFrame = 0; // Reset to the first frame when not moving
    }
  }

  playerDraw(sprite: Sprite) {
    this.sourceX = this.currentFrame * this.frameWidth;
    Global.CTX.save(); // Save the current state of the canvas

    if (this.direction === "left") {
      // Flip the sprite horizontally
      Global.CTX.scale(-1, 1);
      Global.CTX.drawImage(
        sprite.spriteSheet,
        this.sourceX,
        this.sourceY,
        this.frameWidth,
        this.frameHeight, // Source rectangle
        -(this.X + this.frameWidth / 2),
        this.Y - this.frameHeight / 2, // Destination rectangle (negated x to flip)
        this.frameWidth * this.playerScale,
        this.frameHeight * this.playerScale
      );
    } else {
      // Draw normally
      Global.CTX.drawImage(
        sprite.spriteSheet,
        this.sourceX,
        this.sourceY,
        this.frameWidth,
        this.frameHeight, // Source rectangle
        this.X - this.frameWidth / 2,
        this.Y - this.frameHeight / 2, // Destination rectangle
        this.frameWidth * this.playerScale,
        this.frameHeight * this.playerScale
      );
    }

    Global.CTX.restore(); // Restore the Global.CANVAS state
  }
}
