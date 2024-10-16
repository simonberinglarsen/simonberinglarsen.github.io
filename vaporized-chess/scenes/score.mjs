import * as engine from '../engine.mjs';
import * as bishop from '../scenes/bishop.mjs';
import * as game from '../game.mjs';

let state;

// ------------
// engine hooks
// ------------
function init() {
    state = {
        quad: 0,
    };
}

function destroy() {
    state = null;
}

function update() {
    if (engine.keysPressed.includes('Enter')) {
        engine.goToScene(bishop);
    }
    if (engine.tick % 30 == 0) {
        state.quad = (state.quad + 1) % 4;
    }
}

function render() {
    engine.cls();
    let map = {
        [0]: engine.color[1],
        [1]: engine.color[11],
    };
    for (let i = 0; i < 64; i++) {
        const file = i % 8;
        const row = Math.floor(i / 8);
        let color = map[game.state.bishopScore[i]]
        if (game.state.bishopScore[i] == 0) {
            let inActiveQuad = false;
            inActiveQuad = state.quad === 0 && (row < 4 && file < 4)
            || state.quad === 1 && (row < 4 && file >= 4)
            || state.quad === 2 && (row >= 4 && file >= 4)
            || state.quad === 3 && (row >= 4 && file < 4);

            color = inActiveQuad ? engine.color[12] : color;
        }

        engine.fillCirc(file * 20 - 4 * 20 + 300 + 10, row * 20 - 4 * 20 + 200 + 10, 8, color);
    }
    let str = `Time spent: ${Math.floor(game.state.bishopTime)} secs`;
    let x = 300 - str.length * 10;
    let y = 80;
    engine.text(str, x + 2, y + 2, engine.color[2]);
    engine.text(str, x, y, engine.color[10]);
}

export { init, update, render, destroy };