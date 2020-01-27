const Rx = rxjs;
const state$ = new Rx.Subject();
const timerUpdateFrequency = 200;



let state = {
    navigation: {
        page: '',
        expandHotbar: false
    },
    timer: {
        mode: 'idle', //idle -> (inspection, get-ready) -> ready -> started -> idle
        displayTime: '',
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

let oldState = state;

function setState(s) {
    oldState = state;
    state = s;
    state$.next(s);
}

function selectSlice(selector) {
    return state$
        .pipe(
            Rx.operators.map(selector),
            Rx.operators.distinctUntilChanged()
        );
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
    setStateSlice('navigation', { page: 'timer' });
}

$('#hotbar-master').click(() => {
    setStateSlice('navigation', { expandHotbar: !state.navigation.expandHotbar });
});

$('#hotbar-settings').click(() => {
    setStateSlice('navigation', { page: 'settings', expandHotbar: false });
});

$('#settings-close').click(() => {
    setStateSlice('navigation', { page: 'timer', expandHotbar: false });
});

$('#hotbar-scramble').click(() => {
    setStateSlice('navigation', { page: 'scramble', expandHotbar: false });
});

$('#scramble-close').click(() => {
    setStateSlice('navigation', { page: 'timer', expandHotbar: false });
});

$('#hotbar-log').click(() => {
    setStateSlice('navigation', { page: 'log', expandHotbar: false });
});

$('#log-close').click(() => {
    setStateSlice('navigation', { page: 'timer', expandHotbar: false });
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

$('#timer-component').on('touchmove', (e) => { return false; });

$('#timer-component').on('touchend mouseup', () => {
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
            setTimeout(timerWatchDog, timerUpdateFrequency);
        },
        'started': () => { }
    };
    mouseUp[state.timer.mode]();
    return false;
});

$('#timer-component').on('touchstart mousedown', () => {
    const mouseDown = {
        'idle': () => {
            setStateSlice('timer', { mode: 'get-ready', startTime: new Date() });
            setTimeout(timerWatchDog, timerUpdateFrequency);
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
            setTimeout(timerWatchDog, timerUpdateFrequency);
        }
    }
    else if (state.timer.mode === 'inspection' || state.timer.mode === 'started') {
        setTimeout(timerWatchDog, timerUpdateFrequency);
        let elapsed = (new Date() - state.timer.startTime) / 1000;
        setStateSlice('timer', { displayTime: elapsed.toFixed(3) });
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
    function animateCSS(element, animationName, callback) {
        const node = document.querySelector(element)
        node.classList.add('animated', animationName)

        function handleAnimationEnd() {
            node.classList.remove('animated', animationName)
            node.removeEventListener('animationend', handleAnimationEnd)

            if (typeof callback === 'function') callback()
        }

        node.addEventListener('animationend', handleAnimationEnd)
    }

    function simpleShow(element, show) {
        advancedShow(element, show, false);
    }

    function advancedShow(element, show, animated) {
        console.log(`advancedShow(${element}, show:${show}, animate:${animated})`);
        const comp = $(element);
        const isHidden = comp.hasClass("d-none");
        if (isHidden && !show) {
            return;
        }
        comp.removeClass("d-none");
        if (show) {
            if (animated) {
                animateCSS(element, 'bounceInDown', () => { });
            }
            return;
        }
        if (animated) {
            animateCSS(element, 'bounceOutUp', () => {
                comp.removeClass("d-none").addClass("d-none");
            });
        }
        else {
            comp.addClass("d-none");
        }
        return;
    }

    function animateShow(element, show) {
        advancedShow(element, show, false);
    }

    selectSlice((s) => s.navigation.page).subscribe((page) => {
        animateShow('#hotbar-component', page === 'timer');
        animateShow('#settings-component', page === 'settings');
        animateShow('#scramble-component', page === 'scramble');
        animateShow('#log-component', page === 'log');
    });

    selectSlice((s) => s.navigation.expandHotbar).subscribe((navigationExpandHotbar) => {
        const collapsed = !navigationExpandHotbar;
        animateShow('#hotbar-settings', !collapsed);
        animateShow('#hotbar-log', !collapsed);
        animateShow('#hotbar-scramble', !collapsed);
    });

    selectSlice((s) => s.navigation).subscribe((navigation) => {
        renderTimeLog(navigation);
    });

    selectSlice((s) => s.timer).subscribe((timer) => {
        renderTimer(timer);
    });

    selectSlice((s) => s.settings).subscribe((settings) => {
        let yesNo = (b) => b ? 'Yes' : 'No';
        $('#settings-inspection').html(`inspection: ${yesNo(settings.inspection)}`);
        $('#settings-auto-scramble').html(`auto scramble: ${yesNo(settings.autoScramble)}`);
    });

    selectSlice((s) => s.scramble).subscribe((scramble) => {
        $('#scramble-text').empty();
        $('#scramble-text').append(`${scramble.current}`);
    });

    function renderTimer(timer) {
        $('#timer-header').html(timer.mode);
        if (timer.mode === 'idle') {
            const timelog = timer.log;
            let last = timelog[timelog.length - 1];
            if (last) {
                $('#timer-last').html(`${last.time.toFixed(2)}`);
                $('#timer-ao5').html(`${last.ao5.toFixed(2)}`);
                $('#timer-ao12').html(`${last.ao12.toFixed(2)}`);
            }
            else {
                $('#timer-last').html(`---`);
                $('#timer-ao5').html(`---`);
                $('#timer-ao12').html(`---`);
            }
        }
        else {
            $('#timer-ao5').html(`---`);
            $('#timer-ao12').html(`---`);
        }
        if (timer.mode === 'inspection' || timer.mode === 'started') {
            $('#timer-last').html(`${timer.displayTime}`);
        }
    }

    function renderTimeLog() {
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
        renderTimer: renderTimer
    }
})();


startApp();


