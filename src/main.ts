import "./style.css";
import { Global } from "./Global";
import { Background } from "./Background";
import { Player } from "./Player";

Global.CANVAS.width = Global.CANVAS_WIDTH;
Global.CANVAS.height = Global.CANVAS_HEIGHT;
Global.CANVAS.style.border = `1px solid ${Global.CANVAS_BORDER_COLOR}`;

const background = new Background(0, 0, "bg_forest.png");
const player = new Player(10, 10, gameLoop);

const frameWidth = 37; // Width of a single frame
const frameHeight = 37; // Height of a single frame
const totalFrames = 3; // Total number of frames in the animation
let currentFrame = 0; // Index of the current frame
const frameSpeed = 200; // Speed of frame change in milliseconds

let lastFrameTime: number | null = null;
let lastAnimationFrameTime: number | null = null;

let direction = "right"; // Possible values: 'right', 'left'
let isMoving = false;

const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  pause: false,
};

window.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    keys.left = true;
    isMoving = true;
  } else if (event.key === "ArrowRight") {
    keys.right = true;
    isMoving = true;
  } else if (event.key === "ArrowUp") {
    keys.up = true;
    isMoving = true;
  } else if (event.key === "ArrowDown") {
    keys.down = true;
    isMoving = true;
  } else if (event.key === "p" || event.key === "P") {
    keys.pause = !keys.pause;
    gameLoop(0);
  }
});

window.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft") {
    keys.left = false;
  } else if (event.key === "ArrowRight") {
    keys.right = false;
  } else if (event.key === "ArrowUp") {
    keys.up = false;
  } else if (event.key === "ArrowDown") {
    keys.down = false;
  }
  isMoving = keys.left || keys.right || keys.up || keys.down;
});

function gameLoop(timestamp: number) {
  if (Global.PAUSE) {
    return;
  }

  // Initialize lastFrameTime if it's not set
  if (!lastFrameTime || !lastAnimationFrameTime) {
    lastFrameTime = timestamp;
    lastAnimationFrameTime = timestamp;
  }

  // Calculate the time elapsed since the last frame
  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  if (isMoving) {
    //
    const animationDeltaTime = timestamp - lastAnimationFrameTime;
    if (animationDeltaTime > frameSpeed) {
      currentFrame = (currentFrame + 1) % totalFrames;
      lastAnimationFrameTime = timestamp;
    }
  } else {
    currentFrame = 0; // Reset to the first frame when not moving
  }

  Global.CTX.clearRect(0, 0, Global.CANVAS_WIDTH, Global.CANVAS_HEIGHT);

  updatePlayerPosition(deltaTime);

  background.draw();

  // Draw the current frame
  drawFrame(currentFrame);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

function updatePlayerPosition(deltaTime: number) {
  const speed = 0.05; // pixels per millisecond
  let dx = 0;
  let dy = 0;

  if (keys.left) {
    dx -= 1;
    direction = "left";
  }
  if (keys.right) {
    dx += 1;
    direction = "right";
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
    dx = (dx / length) * speed * deltaTime;
    dy = (dy / length) * speed * deltaTime;
  }

  player.X += dx;
  player.Y += dy;
}

function drawFrame(frame: number) {
  const sourceX = frame * frameWidth;
  const sourceY = 0; // Assuming all frames are in a single row

  Global.CTX.save(); // Save the current state of the canvas

  if (direction === "left") {
    // Flip the sprite horizontally
    Global.CTX.scale(-1, 1);
    Global.CTX.drawImage(
      player.spriteSheet,
      sourceX,
      sourceY,
      frameWidth,
      frameHeight, // Source rectangle
      -(player.X + frameWidth / 2),
      player.Y - frameHeight / 2, // Destination rectangle (negated x to flip)
      frameWidth,
      frameHeight
    );
  } else {
    // Draw normally
    Global.CTX.drawImage(
      player.spriteSheet,
      sourceX,
      sourceY,
      frameWidth,
      frameHeight, // Source rectangle
      player.X - frameWidth / 2,
      player.Y - frameHeight / 2, // Destination rectangle
      frameWidth,
      frameHeight
    );
  }

  Global.CTX.restore(); // Restore the Global.CANVAS state
}
