const timerUpdateFrequency = 200;

let state = {
    navigation: {
        page: '',
        expandHotbar: false
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

let oldState = state;

function setState(s) {
    oldState = state;
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
    const hotbarComponent = $('#hotbar-component');

    logComponent.detach();
    timerComponent.detach();
    settingsComponent.detach();
    scrambleComponent.detach();
    hotbarComponent.detach();

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

    function animateShow(element, show) {
        const comp = $(element);
        const isHidden = comp.hasClass("d-none");
        if(isHidden && !show) {
            return;
        }
        if (show) {
            comp.removeClass("d-none");
            animateCSS(element, 'bounceInDown', () => {});
            return;
        }
        else {
            comp.removeClass("d-none");
            animateCSS(element, 'bounceOutUp', () => {
                comp.removeClass("d-none").addClass("d-none");
            });
            return;
        }
    }

    function render() {
        renderTimer(true);
        renderSettings();
        renderScramble();
        renderTimeLog();
        renderHotbar();
    }

    function domAttach(component) {
        let inDom = $.contains(document.documentElement, component.get(0));
        if (!inDom) {
            $('#app').append(component);
        }
    }

    function domDetach(component) {
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

    function renderHotbar() {
        const visible = state.navigation.page === 'timer';
        const visibleBefore = oldState.navigation.page === 'timer';
        if (!visible && visibleBefore) {
            animateCSS('#hotbar-component', 'bounceOutUp', () => {
                domDetach(hotbarComponent);
            });
            return;
        }
        if (visible && !visibleBefore) {
            domAttach(hotbarComponent);
            animateCSS('#hotbar-component', 'bounceInDown', () => {
            });
        }
        const collapsed = !state.navigation.expandHotbar;
        const collapsedBefore = !oldState.navigation.expandHotbar;
        const changed = collapsed != collapsedBefore;
        if (changed) {
            animateShow('#hotbar-settings', !collapsed); 
            animateShow('#hotbar-log', !collapsed); 
            animateShow('#hotbar-scramble', !collapsed); 
        }
    }

    function renderSettings() {
        const collapsed = state.navigation.page !== 'settings';
        domAttach(settingsComponent);
        animateShow(`#${settingsComponent[0].id}`, !collapsed);
        if (collapsed) {
            return;
        }
        let yesNo = (b) => b ? 'Yes' : 'No';
        $('#settings-inspection').html(`inspection: ${yesNo(state.settings.inspection)}`);
        $('#settings-auto-scramble').html(`auto scramble: ${yesNo(state.settings.autoScramble)}`);
    }

    function renderScramble() {
        const collapsed = state.navigation.page !== 'scramble'
        domAttach(scrambleComponent);
        show(scrambleComponent, !collapsed);
        if (collapsed) {
            return;
        }
        $('#scramble-text').empty();
        $('#scramble-text').append(`${state.scramble.current}`);
    }

    function renderTimer(visible) {
        domAttach(timerComponent);
        let elapsed = (new Date() - state.timer.startTime) / 1000;
        $('#timer-header').html(state.timer.mode);
        if (state.timer.mode === 'idle') {
            const timelog = state.timer.log;
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
        if (state.timer.mode === 'inspection' || state.timer.mode === 'started') {
            $('#timer-last').html(`${elapsed.toFixed(3)}`);
        }
        else {

        }
    }

    function renderTimeLog() {
        const collapsed = state.navigation.page !== 'log';
        domAttach(logComponent);
        show(logComponent, !collapsed);
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