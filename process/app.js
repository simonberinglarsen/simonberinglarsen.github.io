const app = new PIXI.Application();
document.body.appendChild(app.view);

// create a new background sprite
const background = PIXI.Sprite.from('assets/bg.jpg');
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChild(background);

// create an array to store a reference to the dudes
const dudeArray = [];

const totaldudes = 20;

for (let i = 0; i < totaldudes; i++) {
    // create a new Sprite that uses the image name that we just generated as its source
    const dude = PIXI.Sprite.from('assets/characters.png');
    // finally let's set the dude to be at a random position...
    dude.x = Math.floor(Math.random() * app.screen.width);
    dude.y = Math.floor(Math.random() * app.screen.height);

    // create some extra properties that will control movement
    dude.direction = Math.random() * Math.PI * 2;
    dude.scale(0.5);

    // create a random speed for the dude between 0 - 2
    dude.speed = 2 + Math.random() * 2;

    // finally we push the dude into the dudeArray so it it can be easily accessed later
    dudeArray.push(dude);

    app.stage.addChild(dude);
}

// create a bounding box for the little dudes
const dudeBoundsPadding = 100;

const dudeBounds = new PIXI.Rectangle(
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app.screen.width + dudeBoundsPadding * 2,
    app.screen.height + dudeBoundsPadding * 2,
);

app.ticker.add(() => {
    // iterate through the dudes and update the positions
    for (let i = 0; i < dudeArray.length; i++) {
        const dude = dudeArray[i];
        dude.x += Math.sin(dude.direction) * dude.speed;
        dude.y += Math.cos(dude.direction) * dude.speed;

        // wrap the dudes by testing their bounds...
        if (dude.x < dudeBounds.x) {
            dude.x += dudeBounds.width;
        } else if (dude.x > dudeBounds.x + dudeBounds.width) {
            dude.x -= dudeBounds.width;
        }

        if (dude.y < dudeBounds.y) {
            dude.y += dudeBounds.height;
        } else if (dude.y > dudeBounds.y + dudeBounds.height) {
            dude.y -= dudeBounds.height;
        }
    }
});
