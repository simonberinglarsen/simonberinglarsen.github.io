let state = {
    navigation: {
        page: 'timer'
    },
    timer: {
        mode: 'idle', //idle -> (inspection, get-ready) -> ready -> started -> idle
        startTime: null,
        log: []
    },
    scramble: {
        current: ''
    },
    settings: {
        inspection: false,
        autoScramble: false,
    }
};

function setState(s) {
    state = s;
    renderModule.render();
}

function setStateSlice(prop, obj) {
    setState({
        ...state,
        [prop]: {
            ...state[prop],
            ...obj
        }
    });
}
function logInfo(msg) {
    $('#debug-log').append(`${msg}\n`)
}

function startApp() {
    [
        35, 39, 29, 30, 35, 36, 35, 41, 35, 36, 31, 32
    ].forEach(time => {
        newScramble();
        insertTimeEntry(time);
    });
}

$('#settings-collapsed').click(() => {
    setStateSlice('navigation', { page: 'settings' });
});

$('#settings-close').click(() => {
    setStateSlice('navigation', { page: 'timer' });
});

$('#scramble-collapsed').click(() => {
    setStateSlice('navigation', { page: 'scramble' });
});

$('#scramble-close').click(() => {
    setStateSlice('navigation', { page: 'timer' });
});

$('#log-collapsed').click(() => {
    setStateSlice('navigation', { page: 'log' });
});

$('#log-close').click(() => {
    setStateSlice('navigation', { page: 'timer' });
});


$('#settings-inspection').click(() => {
    setStateSlice('settings', {
        ...state.settings,
        inspection: !state.settings.inspection
    });
});

$('#settings-auto-scramble').click(() => {
    setStateSlice('settings', {
        ...state.settings,
        autoScramble: !state.settings.autoScramble
    });
});

$('#settings-clear-log').click(() => {
    setStateSlice('timer', {
        ...state.timer,
        log: []
    });
});

$('#timer-action').on('touchmove', (e) => { return false; });
$('#timer-action').on('touchend mouseup', () => {
    logInfo('touchend/mouseup');
    const mouseUp = {
        'idle': () => { },
        'inspection': () => { },
        'get-ready': () => {
            setStateSlice('timer', { mode: 'idle', startTime: null });
        },
        'ready': () => {
            if (state.settings.inspection) {
                setStateSlice('timer', { mode: 'inspection', startTime: new Date() });
            }
            else {
                setStateSlice('timer', { mode: 'started', startTime: new Date() });
            }
            setTimeout(timerWatchDog, 500);
        },
        'started': () => { }
    };
    mouseUp[state.timer.mode]();
    return false;
});


$('#timer-action').on('touchstart mousedown', () => {
    logInfo('touchstart/mousedown');
    const mouseDown = {
        'idle': () => {
            setStateSlice('timer', { mode: 'get-ready', startTime: new Date() });
            setTimeout(timerWatchDog, 500);
        },
        'inspection': () => {
            setStateSlice('timer', { mode: 'started', startTime: new Date() });
        },
        'get-ready': () => { },
        'ready': () => { },
        'started': () => {
            let elapsed = (new Date() - state.timer.startTime) / 1000;
            insertTimeEntry(elapsed);
            if (state.settings.autoScramble) {
                newScramble();
            }
        }
    };
    mouseDown[state.timer.mode]();
    return false;
});
$('#scramble-new').click(newScramble);

function timerWatchDog() {
    if (state.timer.mode === 'get-ready') {
        let elapsed = (new Date() - state.timer.startTime) / 1000;
        if (elapsed > 1) {
            setStateSlice('timer', { mode: 'ready', startTime: null });
        }
        else {
            setTimeout(timerWatchDog, 500);
        }
    }
    else if (state.timer.mode === 'inspection' || state.timer.mode === 'started') {
        setTimeout(timerWatchDog, 500);
        renderModule.render();
    }
}

function insertTimeEntry(elapsedMs) {
    const timerlog = [...state.timer.log];
    let entry = {
        time: elapsedMs,
        ao5: 0,
        ao12: 0,
        scramble: state.scramble.current
    };
    timerlog.push(entry);
    let ao = (num, arr) =>
        arr.length < num ? 0 :
            arr.slice(arr.length - num)
                .map(e => e.time)
                .reduce((acc, cur) => acc + cur, 0) / num;
    entry.ao5 = ao(5, timerlog);
    entry.ao12 = ao(12, timerlog);
    setStateSlice('timer', {
        ...state.timer,
        mode: 'idle',
        startTime: null,
        log: timerlog
    });
}

function newScramble() {
    let operators = 'RLUDBF';
    let variant = ['', `'`, '2'];
    let scramble = '';
    for (let i = 0; i < 20; i++) {
        let idx = Math.floor((Math.random() * operators.length));
        scramble += operators[idx];
        idx = Math.floor((Math.random() * 3));
        scramble += variant[idx];
        scramble += ' ';
    }
    setStateSlice('scramble', {
        ...state.scramble,
        current: scramble
    });

}

const renderModule = (function renderModule() {
    const logComponent = $('#log-component');
    const timerComponent = $('#timer-component');
    const settingsComponent = $('#settings-component');
    const scrambleComponent = $('#scramble-component');

    logComponent.detach();
    timerComponent.detach();
    settingsComponent.detach();
    scrambleComponent.detach();

    function render() {
        renderTimer(true);
        renderSettings(state.navigation.page !== 'settings');
        renderScramble(state.navigation.page !== 'scramble');
        renderTimeLog(state.navigation.page !== 'log');
    }

    function domAttached(component) {
        let inDom = $.contains(document.documentElement, component.get(0));
        if (!inDom) {
            $('#app').append(component);
        }
    }

    function domDetached(component) {
        let inDom = $.contains(document.documentElement, component.get(0));
        if (inDom) {
            component.detach();
        }
    }

    function show(bootstrapElement, show) {
        if (show) {
            bootstrapElement.removeClass("d-none");
        }
        else {
            bootstrapElement.removeClass("d-none").addClass("d-none");
        }
    }

    function renderSettings(collapsed) {
        domAttached(settingsComponent);
        show($('#settings-collapsed'), collapsed);
        show($('#settings-expanded'), !collapsed);
        if (collapsed) {
            return;
        }
        let yesNo = (b) => b ? 'Yes' : 'No';
        $('#settings-inspection').html(`inspection: ${yesNo(state.settings.inspection)}`);
        $('#settings-auto-scramble').html(`auto scramble: ${yesNo(state.settings.autoScramble)}`);
    }

    function renderScramble(collapsed) {
        domAttached(scrambleComponent);
        show($('#scramble-collapsed'), collapsed);
        show($('#scramble-expanded'), !collapsed);
        if (collapsed) {
            return;
        }
        $('#scramble-text').empty();
        $('#scramble-text').append(`${state.scramble.current}`);
    }

    function renderTimer(visible) {
        domAttached(timerComponent);
        let elapsed = (new Date() - state.timer.startTime) / 1000;
        show($('#timer-ready'), state.timer.mode === 'ready');
        if (state.timer.mode === 'inspection' || state.timer.mode === 'started') {
            $('#timer-text').html(`${state.timer.mode}, ${elapsed.toFixed(3)}`);
        }
        else {
            $('#timer-text').html(state.timer.mode);
        }
    }

    function renderTimeLog(collapsed) {
        domAttached(logComponent);
        show($('#log-collapsed'), collapsed);
        show($('#log-expanded'), !collapsed);
        if (collapsed) {
            return;
        }
        $('#log-text').empty();
        const timelog = state.timer.log;
        let index = timelog.length;
        timelog
            .slice(Math.max(0, timelog.length - 5))
            .reverse()
            .forEach(t => {
                $('#log-text').append(`<div>${index--}, ${t.time.toFixed(2)}, ${t.ao5.toFixed(2)}, ${t.ao12.toFixed(2)}, ${t.scramble.substring(0, 8)}...</div>`);
            });
        if (timelog.length > 5) {
            $('#log-text').append(`<div>...</div>`);
        }
    }

    return {
        render: render
    }
})();

startApp();