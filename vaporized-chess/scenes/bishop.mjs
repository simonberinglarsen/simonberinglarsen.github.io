import * as engine from '../engine.mjs';
import * as score from '../scenes/score.mjs';
import * as game from '../game.mjs';

// ---------
// game vars
// ---------
let entities;
let state;

class Entity {
    constructor(x, y, ext, group, text) {
        this.x = x;
        this.y = y;
        this.ext = ext;
        this.tx = x;
        this.ty = y;
        this.t = 0;
        this.dt = 0;
        this.group = group;
        this.text = text;
        this.visible = true;
        this.color = engine.color[8];
    }

    setTarget(x, y, speed) {
        this.tx = x;
        this.ty = y;
        this.t = 0;
        this.dt = speed;
    }

    update() {
        this.t += this.dt;
        if (this.t >= 1) {
            this.x = this.tx;
            this.y = this.ty;
            this.t = 0;
            this.dt = 0;
        }
        else {
            this.x = this.tx * (this.t) + this.x * (1 - this.t);
            this.y = this.ty * (this.t) + this.y * (1 - this.t);
        }
        if (this.life) {
            this.life -= 1;
            if (this.life <= 0) {
                this.dead = true;
            }
        }
    }
}

// -------------
// Scene helpers
// -------------
function squareToText(square) {
    const file = String.fromCharCode(65 + (square % 8)); // 65 is 'A'
    const rank = 8 - Math.floor(square / 8);
    return `${file}${rank}`;
}

function textToSquare(text) {
    const file = text.charCodeAt(0) - 65; // 'A' is 65
    const rank = 8 - parseInt(text[1]);
    return rank * 8 + file;
}

function lastEntity() {
    return entities[entities.length - 1];
}

function setAnswerText(txt) {
    state.answerText = txt;
    let e = entities.find(e => e.group === 'answer');
    e.x = 300 - txt.length * 10;
    e.text = txt;
}

function setupQuestionAndSolution() {
    let unsolvedSquares = game.state.bishopScore
        .map((res, i) => res === 1 ? -1 : i)
        .filter(x => x !== -1);
    state.square = unsolvedSquares[Math.floor(Math.random() * unsolvedSquares.length)];
    state.questionText = `Bishop on ${squareToText(state.square)}, edge squares?`;
    let question = entities.find(e => e.group === 'question');
    question.text = state.questionText;
    question.setTarget(300 - state.questionText.length * 10, 40, 0.1);
    const edges = [];
    const file = state.square % 8, rank = Math.floor(state.square / 8);
    for (let i = 1; i < 8; i++) {
        if (file + i < 8 && rank + i < 8) edges[0] = (rank + i) * 8 + (file + i); // ↘
        if (file - i >= 0 && rank - i >= 0) edges[1] = (rank - i) * 8 + (file - i); // ↖
        if (file + i < 8 && rank - i >= 0) edges[2] = (rank - i) * 8 + (file + i); // ↗
        if (file - i >= 0 && rank + i < 8) edges[3] = (rank + i) * 8 + (file - i); // ↙
    }
    state.solution = edges.filter(e => e !== null).map(e => squareToText(e));
}

function addDial(str, radius, groupName) {
    entities.push(...str
        .split('')
        .map((letter, i) => new Entity(
            Math.cos(Math.PI * 2 / 8 * i - Math.PI / 2) * radius + 300,
            Math.sin(Math.PI * 2 / 8 * i - Math.PI / 2) * radius + 200,
            { type: 'DialNode', size: 20 },
            groupName,
            letter
        )));
    entities.filter(e => e.group === groupName).forEach(e => {
        e.setTarget(e.x, e.y, 0.1);
        e.x = 300;
        e.y = 200;
    });
}

function addLabel(str, group, x, y, color) {
    entities.push(new Entity(x, y, { type: 'Label' }, group, str));
    lastEntity().color = color;
}

function moveGroupToFont(name) {
    let theRest = [];
    let theGroup = [];
    for (let e of entities) {
        e.group === name ? theGroup.push(e) : theRest.push(e);
    }
    entities = [...theRest, ...theGroup];
}

function updateOnArrowUpDown(allDialNodes) {
    if (engine.keysPressed.includes('ArrowDown')) {
        state.selectedDial = (state.selectedDial + 1) % 3;
    }
    if (engine.keysPressed.includes('ArrowUp')) {
        state.selectedDial = (state.selectedDial + 2) % 3;
    }
}

function updateRotateDial(letterOrDigit, direction) {
    let isDigit = state.selectedDial === 1;
    if (letterOrDigit[0].dt === 0) {
        let from = (isDigit ? '12345678' : 'ABCDEFGH').split('');
        let to = (isDigit ? '23456781' : 'BCDEFGHA').split('');
        if (direction === 'counter-clockwise') {
            [from, to] = [to, from];
        }
        let currentPositions = {};
        letterOrDigit.forEach(l => currentPositions[l.text] = { x: l.x, y: l.y });
        letterOrDigit.forEach(l => {
            let indexOfLetter = from.indexOf(l.text);
            let targetLetter = to[indexOfLetter];
            let targetPos = currentPositions[targetLetter];
            l.setTarget(targetPos.x, targetPos.y, 0.3)
        });
    }
}

function updateOnArrowLeftRight(allDialNodes) {
    let selectedDial = state.selectedDial;
    let activeGroupName = ['letters', 'digits', 'ok'][selectedDial];
    let activeGroup = entities.filter(e => e.group === activeGroupName);
    allDialNodes.forEach(e => { e.ext.size = 20; e.color = engine.color[5] });
    let i=0;
    activeGroup.forEach(e => { e.ext.size = 22; e.color = engine.color[8 + i++] });
    moveGroupToFont(activeGroupName);

    let rotateDialDirection = null;
    if (engine.keysPressed.includes('ArrowRight')) {
        rotateDialDirection = 'clockwise';
    }
    if (engine.keysPressed.includes('ArrowLeft')) {
        rotateDialDirection = 'counter-clockwise';
    }
    if (rotateDialDirection && selectedDial < 2) {
        updateRotateDial(activeGroup, rotateDialDirection);
    }
}

function updateOnSolved() {
    state.solved = true;
    const elapsedSeconds = (new Date() - state.startTime) / 1000;
    game.state.bishopTime += elapsedSeconds;
    game.state.bishopScore[state.square] = 1;
    entities.find(e => e.group === 'welldone').setTarget(200, 200, 0.1);
    entities.filter(e => e.group === 'letters').forEach(e => e.setTarget(e.x - 600, e.y, 0.005));
    entities.filter(e => e.group === 'digits').forEach(e => e.setTarget(e.x - 600, e.y, 0.005));
    entities.filter(e => e.group === 'ok').forEach(e => e.setTarget(e.x - 600, e.y, 0.005));
    entities.filter(e => e.group === 'question').forEach(e => e.setTarget(e.x, -40, 0.005));
}

function updateOnNewAnswer(selectionText) {
    setAnswerText((state.answerText + ' ' + selectionText).trim())
    for (let i = 0; i < 250; i++) {
        let randomAngle = Math.PI * 2 * Math.random();
        let angle = {
            x: Math.cos(randomAngle),
            y: Math.sin(randomAngle)
        };
        let r = Math.random() * 600;
        let e = new Entity(300, 200, { type: 'Circle', size: (r / 600) * 10 });
        e.color = engine.color[Math.floor(Math.random() * 16)];
        e.setTarget(angle.x * r + 300, angle.y * r + 200, Math.random() * 0.1 + 0.01);
        e.life = r / 600 * 50;
        entities.push(e);
    }
}

function updateOnSubmitAnswer(selection) {
    let letter = selection.find(e => e.group === 'letters').text;
    let digit = selection.find(e => e.group === 'digits').text;
    let selectionText = letter + digit;
    let solution = state.solution;
    let correctSolution = solution.includes(selectionText);
    let newAnswer = !state.answerText.includes(selectionText);

    if (!correctSolution) {
        state.shake = 10;
    }
    else if (newAnswer) {
        updateOnNewAnswer(selectionText);
    }
    let completeAnswer = solution.every(square => state.answerText.includes(square));
    if (completeAnswer && !state.solved) {
        updateOnSolved();
    }
}

function updateOnEnterKey(allDialNodes) {
    let selection = allDialNodes.filter(e => e.x > 280 && e.x < 320 && e.y > 80 && e.y < 160);
    if (state.selectedDial === 2) {
        selection.forEach(e => e.color = engine.color[11]);
    }
    if (engine.keysPressed.includes('Enter') && state.selectedDial === 2) {
        updateOnSubmitAnswer(selection);
    }
}

function renderCircle(e) {
    const entitySize = e.ext.size;
    let ofsx = 0;
    let ofsy = 0;
    let inSelectedDial = state.selectedDial === 0 && e.group === 'letters' ||
        state.selectedDial === 1 && e.group === 'digits' ||
        state.selectedDial === 2 && e.group === 'ok';
    if (inSelectedDial) {
        let t = (((engine.tick + e.text.charCodeAt(0) * 4) % 60) / 60) * 2 * Math.PI;
        ofsx = Math.cos(t * 5) * 2;
        ofsy = Math.sin(t * 3) * 2;
    }
    let x = Math.floor(e.x + ofsx);
    let y = Math.floor(e.y + ofsy);
    engine.fillCirc(x, y, entitySize, e.color);
    if (e.text) {
        engine.text(e.text, x - 10, y + 10, engine.color[0]);
    }
}

function renderLabel(e) {
    let ofs = 0;
    if (e.group === 'answer') {
        let t = ((engine.tick % 40) / 40) * 2 * Math.PI;
        ofs = Math.cos(t) * 10;
    }
    engine.text(e.text, e.x + ofs, e.y, e.color);
}

function renderEntities() {
    entities.forEach((e, i) => {
        if (!e.visible) return;
        if (e.ext.type === 'DialNode' || e.ext.type === 'Circle') {
            renderCircle(e);
        }
        else if (e.ext.type === 'Label') {
            renderLabel(e);
        }
    });
}

// ------------
// engine hooks
// ------------
function init() {
    entities = []
    state = {
        selectedDial: 0,
        selectionText: '',
        questionText: '',
        square: -1,
        answerText: '',
        solution: [],
        shake: 0,
        solved: false,
        startTime: new Date()
    }
    addDial('ABCDEFGH', 100, 'letters');
    addDial('12345678', 60, 'digits');
    addDial('^', 20, 'ok');

    addLabel('...', 'question', 20, -40, engine.color[[7]]);
    addLabel('', 'answer', 0, 380, engine.color[11]);
    addLabel('WELL DONE!', 'welldone', 650, 200, engine.color[2]);

    setupQuestionAndSolution();
}

function destroy() {
    entities = null;
    state = null;
}

function update() {
    let allDialNodes = entities.filter(e => e.ext.type === "DialNode")
    if (!state.solved) {
        updateOnArrowUpDown(allDialNodes);
        updateOnArrowLeftRight(allDialNodes);
        updateOnEnterKey(allDialNodes)
    }
    else {
        if (engine.keysPressed.includes('Enter')) {
            engine.goToScene(score);
        }
    }
    entities.forEach(e => { e.update(); })
    entities = entities.filter(e => !e.dead);
    if (state.shake > 0) {
        state.shake--;
    }
}

function render() {
    engine.cls();

    if (state.shake > 0) {
        engine.pushMatrix();
        engine.translate((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
    }

    renderEntities();

    if (state.shake > 0) {
        engine.popMatrix();
    }

    // debug info:
    //engine.text(`#e = ${entities.length}`, 0, 20, engine.color[1])
}

export { init, update, render, destroy };