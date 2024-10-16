const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 512;
canvas.height = 512;

const fps = 30;
const interval = 1000 / fps;
const centerx = canvas.width / 2;
const centery = canvas.height / 2;
const textSize = 16;
let lastTime = 0;
let tick = 0;
let game = null;
let keysPressed = [];
let nextScene = null;


const color = [
    "#000000",   //  0 black
    "#1D2B53",   //  1 dark-blue
    "#7E2553",   //  2 dark-purple
    "#008751",   //  3 dark-green
    "#AB5236",   //  4 brown
    "#5F574F",   //  5 dark-grey
    "#C2C3C7",   //  6 light-grey
    "#FFF1E8",   //  7 white
    "#FF004D",   //  8 red
    "#FFA300",   //  9 orange
    "#FFEC27",   // 10 yellow
    "#00E436",   // 11 green
    "#29ADFF",   // 12 blue
    "#83769C",   // 13 lavender
    "#FF77A8",   // 14 pink
    "#FFCCAA"    // 15 light-peach
];

function onKeyPress(code) {
    if (!keysPressed.includes(code)) {
        keysPressed.push(code);
    }
}

window.addEventListener('keydown', function (event) {
    onKeyPress(event.code);
});

function run(g) {
    game = g;
    game.init();
    requestAnimationFrame(gameLoop);
}

function handleSceneChange() {
    game.destroy();
    game = nextScene;
    game.init();
    nextScene = null;
}

function gameLoop(time) {
    const deltaTime = time - lastTime;
    if (deltaTime >= interval) {
        tick++;
        if (nextScene) {
            handleSceneChange();
        }
        game.update();
        game.render();
        keysPressed = [];
        lastTime = time;
    }
    requestAnimationFrame(gameLoop);
}

function cls() {
    ctx.fillStyle = color[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function pushMatrix() {
    ctx.save();
}

function popMatrix() {
    ctx.restore();
}

function translate(x, y) {
    ctx.translate(x, y);
}

function fillCirc(x, y, size, color) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function fillRect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function text(txt, x, y, color) {
    ctx.font = `${textSize}px 'Press Start 2P', monospace`;
    ctx.fillStyle = color;
    ctx.fillText(txt, x, y);
}

function goToScene(newScene) {
    nextScene = newScene;
}

function textWidth(txt) {
    return txt.length * 16;
}

export {
    run,
    tick,
    color,
    keysPressed,
    centerx,
    centery,
    textSize,
    cls, pushMatrix, popMatrix, translate, fillCirc, text, goToScene, textWidth, fillRect, onKeyPress
};