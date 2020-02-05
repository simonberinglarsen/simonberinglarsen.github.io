const Rx = rxjs;
const state$ = new Rx.Subject();
const timerUpdateFrequency = 123;

let state = {
    navigation: {
        page: '',
        expandHotbar: false
    },
    timer: {
        mode: 'idle', //idle -> (inspection, get-ready) -> ready -> started -> idle
        displayTime: '',
        displayTimeMajor: '',
        displayTimeMinor: '',
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
    state$.next(s);
}

function selectStateSlice(selector) {
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

let lineno = 1;
function logInfo(msg) {
    $('#debug-log').append(`${lineno++} : ${msg}\n`)
}

function startApp() {
    [
        35, 39, 29, 30, 35, 36, 35, 41, 35, 36, 31, 32
    ].forEach(time => {
        newScramble();
        insertTimeEntry(time);
    });
    logInfo(`version: 1.1`);
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


$('#settings-clear-dbg').click(() => {
    $('#debug-log').empty();
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
        setStateSlice('timer', { displayTime: elapsed });
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
        advancedShow(element, show, false, '', '');
    }

    function advancedShow(element, show, animated, animationClassIn, animationClassOut) {
        const comp = $(element);
        const isHidden = comp.hasClass("d-none");
        if (isHidden && !show) {
            return;
        }
        comp.removeClass("d-none");
        if (show) {
            if (animated) {
                animateCSS(element, `${animationClassIn}`, () => { });
            }
            return;
        }
        if (animated) {
            animateCSS(element, `${animationClassOut}`, () => {
                const x = $(element);
                if (!x.hasClass(`${animationClassIn}`)) {
                    comp.removeClass("d-none").addClass("d-none");
                }
            });
        }
        else {
            comp.addClass("d-none");
        }
        return;
    }

    function animateShow(element, show) {
        advancedShow(element, show, true, 'bounceInDown', 'bounceOutUp');
    }

    function animateShowFade(element, show) {
        advancedShow(element, show, true, 'bounceIn', 'bounceOut');
    }

    selectStateSlice((s) => s.navigation.page).subscribe((page) => {
        animateShow('#hotbar-component', page === 'timer');
        animateShow('#settings-component', page === 'settings');
        animateShow('#scramble-component', page === 'scramble');
        animateShow('#log-component', page === 'log');
        animateShow('#hotbar-master', page === 'timer');
    });

    selectStateSlice((s) => s.navigation.expandHotbar).subscribe((navigationExpandHotbar) => {
        const collapsed = !navigationExpandHotbar;
        animateCSS('#hotbar-master', 'rubberBand');
        animateShow('#hotbar-settings', !collapsed);
        animateShow('#hotbar-log', !collapsed);
        animateShow('#hotbar-scramble', !collapsed);
    });

    selectStateSlice((s) => s.navigation).subscribe((navigation) => {
        renderTimeLog(navigation);
    });

    selectStateSlice((s) => s.timer).subscribe((timer) => {
        renderTimer(timer);
        renderMode(timer.mode);
    });

    function renderMode(mode) {
        logInfo(`mode = ${mode}`);
        $('#timer-stage-idle').removeClass("bg-success bg-white text-secondary");
        $('#timer-stage-get-ready').removeClass("bg-warning bg-white text-secondary");
        $('#timer-stage-ready').removeClass("bg-warning bg-white text-secondary");
        $('#timer-stage-inspection').removeClass("bg-warning bg-white text-secondary");
        $('#timer-stage-started').removeClass("bg-danger bg-white text-secondary");
        logInfo(`classes removed`);

        const showinspection = mode === 'inspection' || (!state.settings.inspection && mode === 'ready');
        $('#timer-stage-idle').addClass(mode === 'idle' ? 'bg-success' : 'text-secondary');
        $('#timer-stage-get-ready').addClass(mode === 'get-ready' ? 'bg-warning' : 'text-secondary');
        $('#timer-stage-ready').addClass(mode === 'ready' ? 'bg-warning' : 'text-secondary');
        $('#timer-stage-inspection').addClass(showinspection ? 'bg-warning' : 'text-secondary');
        $('#timer-stage-started').addClass(mode === 'started' ? 'bg-danger' : 'text-secondary');
        logInfo(`classes added`);

        logInfo(JSON.stringify($('#timer-stage-idle')[0].classList));
    }

    selectStateSlice((s) => s.settings).subscribe((settings) => {
        let yesNo = (b) => b ? 'Yes' : 'No';
        $('#settings-inspection').html(`inspection: ${yesNo(settings.inspection)}`);
        $('#settings-auto-scramble').html(`auto scramble: ${yesNo(settings.autoScramble)}`);
    });

    selectStateSlice((s) => s.scramble).subscribe((scramble) => {
        $('#scramble-text').empty();
        $('#scramble-text').append(`${scramble.current}`);
    });

    function renderTimer(timer) {
        const timerModeText = {
            'idle': 'ready?',
            'inspection': 'shhh..',
            'get-ready': 'SET ??',
            'ready': 'YES! IM READY!',
            'started': 'GO GO GO!',
        };
        $('#timer-header').html(timerModeText[timer.mode]);
        if (timer.mode === 'idle') {
            const timelog = timer.log;
            let last = timelog[timelog.length - 1];
            if (last) {
                $('#timer-last-major').html(`${timeMajorText(last.time)}`);
                $('#timer-last-minor').html(`${timeMinorText(last.time)}`);
                $('#timer-ao5').html(`${last.ao5.toFixed(2)}`);
                $('#timer-ao12').html(`${last.ao12.toFixed(2)}`);
            }
            else {
                $('#timer-last-major').html(`---`);
                $('#timer-last-minor').html(`---`);
                $('#timer-ao5').html(`---`);
                $('#timer-ao12').html(`---`);
            }
        }
        else {
            $('#timer-ao5').html(`---`);
            $('#timer-ao12').html(`---`);
        }
        if (timer.mode === 'inspection' || timer.mode === 'started') {
            $('#timer-last-major').html(`${timeMajorText(timer.displayTime)}`);
            $('#timer-last-minor').html(`${timeMinorText(timer.displayTime)}`);
        }
    }

    function timeMinorText(elapsed) {
        return !elapsed ? '' : (elapsed % 1).toFixed(3).substring(1);
    }

    function timeMajorText(elapsed) {
        return !elapsed ? '' : elapsed.toFixed(0);
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


