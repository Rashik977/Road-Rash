import "./style.css";
import { Global } from "./Global";
import { Background } from "./Background";
import { Player } from "./Player";
import { Sprite } from "./Sprite";
import { KeyControls } from "./KeyControls";

Global.CANVAS.width = Global.CANVAS_WIDTH;
Global.CANVAS.height = Global.CANVAS_HEIGHT;
Global.CANVAS.style.border = `1px solid ${Global.CANVAS_BORDER_COLOR}`;

const sprite = new Sprite("characters1.png", gameLoop);
const background = new Background(0, 0, "bg_forest.png");
const player = new Player(Global.CANVAS_WIDTH / 2, Global.CANVAS_HEIGHT / 2);
const controlls = new KeyControls();

let lastFrameTime: number | null = null;

controlls.keydown(gameLoop);
controlls.keyup();

function gameLoop(timestamp: number) {
  if (Global.PAUSE) {
    return;
  }

  // Initialize lastFrameTime if it's not set
  if (!lastFrameTime) {
    lastFrameTime = timestamp;
  }

  // Calculate the time elapsed since the last frame
  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  player.playerAnimationUpdate(timestamp, controlls.isMoving);

  Global.CTX.clearRect(0, 0, Global.CANVAS_WIDTH, Global.CANVAS_HEIGHT);

  player.playerUpdate(deltaTime, controlls.keys);

  background.draw();

  // Draw the current frame
  player.playerDraw(sprite);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}
