const hardware = {
    leds: []
}

const GameModes = {
    InsertCoin: 1,
    Playing: 2,
    Dead: 3,
    GameOver: 4
}

const WorkermanPos = {
    Hole1: 3,
    Hole2: 6,
    Hole3: 17,
    Hole4: 14,
}

const state = {
    tick: 0,
    enableAI: false,
    gamemode: GameModes.InsertCoin,
    showForeground: true,
    playerPosAtHole: 1,
    workerman: [],
    deadAnimation: 0,
    workerFallen: false,
    workerDeadAtHole1: false,
    workerDeadAtHole2: false,
    workerDeadAtHole3: false,
    workerDeadAtHole4: false,
}



function init() {
    state.workerman = [];
    let count = 21;
    while (count--) state.workerman[count] = false;
    $('#btn-a').click(() => {
        if (state.gamemode == GameModes.Playing) {
            state.playerPosAtHole = 1;
        }
        updateUI();
    });
    $('#btn-b').click(() => {
        if (state.gamemode == GameModes.Playing) {
            state.playerPosAtHole = 2;
        } updateUI();
    });
    $('#btn-c').click(() => {
        if (state.gamemode == GameModes.Playing) {
            state.playerPosAtHole = 3;
        } updateUI();
    });
    $('#btn-d').click(() => {
        if (state.gamemode == GameModes.Playing) {
            state.playerPosAtHole = 4;
        } updateUI();
    });
    $('#btn-toggle-layer').click(() => {
        state.showForeground = !state.showForeground;
        $('#layer4').css('opacity', state.showForeground ? '100' : '0');
    });
    $('#btn-toggle-ai').click(() => {
        state.enableAI = !state.enableAI
        $('#btn-toggle-ai').removeClass('selected').addClass(state.enableAI ? 'selected' : '');
    });
}

function updateUI() {
    mapStateToHardware();
    for (var i = 0; i < hardware.leds.length; i++) {
        const ledOn = hardware.leds[i];
        $(`#led${i + 1}`).css('fill', ledOn ? '#ffff00' : '#103040');
    }
}


function tick() {
    state.tick++;
    switch (state.gamemode) {
        case GameModes.InsertCoin:
            state.gamemode = GameModes.Playing;
            break;
        case GameModes.Playing:
            for (var i = state.workerman.length - 1; i > 0; i--) {
                state.workerman[i] = state.workerman[i - 1];
            }
            const potentialDoubleFall = state.workerman[3] ||  state.workerman[8] || state.workerman[11] || state.workerman[14];
            const totalWorkers = state.workerman.map(w => w ? 1 : 0).reduce((p,c) => p+c,0);
            const spawnRandomly = (Math.random() < 0.15 && !potentialDoubleFall);
            let spawnWorker = (totalWorkers === 0 && Math.random() < 0.50) || spawnRandomly;
            state.workerman[0] = spawnWorker;
            state.workerDeadAtHole1 = state.workerman[WorkermanPos.Hole1] && state.playerPosAtHole !== 1;
            state.workerDeadAtHole2 = state.workerman[WorkermanPos.Hole2] && state.playerPosAtHole !== 2;
            state.workerDeadAtHole3 = state.workerman[WorkermanPos.Hole3] && state.playerPosAtHole !== 3;
            state.workerDeadAtHole4 = state.workerman[WorkermanPos.Hole4] && state.playerPosAtHole !== 4;
            if (state.workerDeadAtHole1 || state.workerDeadAtHole2 || state.workerDeadAtHole3 || state.workerDeadAtHole4) {
                state.gamemode = GameModes.Dead;
                state.deadAnimation = 12;
            }

            if(state.enableAI) {
                if(state.workerman[2]) {
                    state.playerPosAtHole = 1;
                }
                else if(state.workerman[5]) {
                    state.playerPosAtHole = 2;
                }
                else if(state.workerman[13]) {
                    state.playerPosAtHole = 4;
                }
                else if(state.workerman[16]) {
                    state.playerPosAtHole = 3;
                }
                
            }
            break;
        case GameModes.GameOver:
            break;
        case GameModes.Dead:
            state.deadAnimation--;
            if (state.deadAnimation === 11) {
                state.workerFallen = false;
                state.blinkWorker = true;
            }
            if (state.deadAnimation === 6) {
                state.workerFallen = true;
                state.workerman[WorkermanPos.Hole1] &= !state.workerDeadAtHole1;
                state.workerman[WorkermanPos.Hole2] &= !state.workerDeadAtHole2;
                state.workerman[WorkermanPos.Hole3] &= !state.workerDeadAtHole3;
                state.workerman[WorkermanPos.Hole4] &= !state.workerDeadAtHole4;
            }
            else if (state.deadAnimation === 0) {
                state.workerDeadAtHole1 = false;
                state.workerDeadAtHole2 = false;
                state.workerDeadAtHole3 = false;
                state.workerDeadAtHole4 = false;
                state.workerFallen = false;
                state.blinkWorker = false;
                state.gamemode = GameModes.Playing;
            }
            break;
    }

    updateUI();
    scheduleNextState();
}

function mapStateToHardware() {
    hardware.leds[11] = state.playerPosAtHole === 1;
    hardware.leds[12] = state.playerPosAtHole === 2;
    hardware.leds[25] = state.playerPosAtHole === 3;
    hardware.leds[26] = state.playerPosAtHole === 4;

    for (var i = 0; i < 10; i++) {
        hardware.leds[i] = state.workerman[i];
        hardware.leds[23 - i] = state.workerman[i + 11];
    }

    hardware.leds[10] = state.workerDeadAtHole1 && state.workerFallen;
    hardware.leds[13] = state.workerDeadAtHole2 && state.workerFallen;
    hardware.leds[24] = state.workerDeadAtHole3 && state.workerFallen;
    hardware.leds[27] = state.workerDeadAtHole4 && state.workerFallen;

    const blinkers = [];
    if (state.workerDeadAtHole1) {
        blinkers.push(3);
    }
    if (state.workerDeadAtHole2) {
        blinkers.push(6);
    }
    if (state.workerDeadAtHole3) {
        blinkers.push(17);
    }
    if (state.workerDeadAtHole4) {
        blinkers.push(20);
    }
    if (state.blinkWorker && state.tick % 2 === 0) {
        blinkers.forEach(n => hardware.leds[n] = false);
    }
}

function scheduleNextState() {
    setTimeout(tick, 500);
}

init();
scheduleNextState();



