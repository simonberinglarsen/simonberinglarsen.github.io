const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 640;

const screenX = 16;
const screenY = 16;
const screenSize = screenY * screenX;
const fieldSize = canvas.clientWidth / screenX;
const screen = [];
let background = null;
let lastUpdate = new Date();
let state = {
    
};


let entities = [];

function newEntity() {
    let dx = 1;
    let dy = 1;
    let posx = 0;
    let posy = 0;

    return {
        update: function () {
            posx += dx;
            if (posx === 16 || posx === -1) {
                dx *= -1;
                posx += dx;
                posy += dy;
                if (posy === 16 || posy === -1) {
                    dy *= -1;
                    posy += dy;
                }
            }
            setPixel(posx, posy);
        }
    }
}

function update() {
    clearPixels();
    let spawn = Math.random()<0.05;
    if(spawn && entities.length < 10) {
        entities.push(newEntity());
    }
    entities.forEach(e => {
        e.update();
    });

}

function clearPixels() {
    for (var i = 0; i < screenSize; i++) {
        screen[i] = 0;
    }
}

function setPixel(x, y) {
    screen[x + y * screenX] = 1;
}

function renderScreen() {
    for (var i = 0; i < screenSize; i++) {
        var x = i % screenX;
        var y = Math.floor(i / screenX);
        if (screen[i] !== 0) {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(x * fieldSize, y * fieldSize, fieldSize, fieldSize);
        }
    }
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    let elapsed = new Date() - lastUpdate;
    if (elapsed <= 10) {
        return;
    }
    lastUpdate = new Date();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    renderScreen();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function loadAssets() {
    background = new Image();   // Create new img element
    background.addEventListener('load', function () {
        requestAnimationFrame(gameLoop);
    }, false);
    background.src = './background.png'; // Set source path
}

loadAssets();

