var { interval, Subject } = rxjs;
var { map, distinctUntilChanged, takeUntil } = rxjs.operators;


class InspectionService {
    constructor() {
        this.startTime = new Date();
        this.started = false;
        this.elapsed = 0;
        this.destroy$ = new Subject();
    }

    start() {
        if (this.started) {
            return;
        }
        this.started = true;
        this.startTime = new Date();
        this.destroy$.next();
        interval(200)
            .pipe(takeUntil(this.destroy$))
            .subscribe((x) => {
                this.calcElapsed();
                let color = 'bg-success';
                if (this.elapsed >= 8) {
                    color = 'bg-warning';
                }
                if (this.elapsed >= 12) {
                    color = 'bg-danger';
                }
                if (this.elapsed >= 15) {
                    color = 'bg-danger';
                    this.stop();
                }
                $('#scr-details-inspect-text').removeClass('bg-success bg-warning bg-danger').addClass(color);
                $('#scr-details-inspect-text').html(this.elapsed);
            });
    }

    stop() {
        this.destroy$.next();
        this.calcElapsed();
        this.started = false;
    }

    calcElapsed() {
        this.elapsed = Math.floor((new Date() - this.startTime) / 1000);
    }
}

class Store {
    constructor() {
        this.state$ = new Subject();
        this.state = {
            navigation: {
                page: '',
            },
            timer: {
                started: false
            }
        };
    }
    select(selector) {
        return this.state$
            .pipe(
                map(selector),
                distinctUntilChanged()
            );
    }
    setSlice(prop, obj) {
        this.state = {
            ...this.state,
            [prop]: {
                ...this.state[prop],
                ...obj
            }
        };
        this.state$.next(this.state);
    }
}

const store = new Store();
const inspectionService = new InspectionService();

$('#btn-scramble').click(() => {
    store.setSlice('navigation', { page: '/scramble' });
});
$('#btn-inspect').click(() => {
    store.setSlice('navigation', { page: '/inspect' });
});
$('#btn-log').click(() => {
    store.setSlice('navigation', { page: '/log' });
});

$('#scr-actions-scramble-create').click(() => {
    $('#scr-details-scramble-text').html(`${getScramble()}`);
});

$('#scr-actions-scramble-forward').click(() => {
    store.setSlice('navigation', { page: '/inspect' });
});

$('#scr-actions-inspect-forward').click(() => {
    store.setSlice('navigation', { page: '/log' });
});

$('#scr-actions-inspect-forward').click(() => {
    store.setSlice('navigation', { page: '/log' });
});

$('#scr-actions-log-forward').click(() => {
    store.setSlice('navigation', { page: '/scramble' });
});

$('#scr-actions-inspect-play').click(() => {
    store.setSlice('timer', { started: !store.state.timer.started });
});

$('#btn-go-fullscreen').click(() => {
    screenfull.request();
    setVisible($('#app-fullscreen'), false);
    setVisible($('#app'), true);
});


function getScramble() {
    let text = '';
    let last = '';
    let rnd = (x) => x[Math.floor(Math.random() * x.length)];
    for (let i = 0; i < 25; i++) {
        let faces = ['R', 'L', 'F', 'B', 'U', 'D'];
        faces = faces.filter(f => f !== last);
        last = rnd(faces);
        let direction = ['\'', '2', ''];
        text += `${last}${rnd(direction)} `;
    }
    return text;
}

function setVisible(e, show) {
    e.removeClass('d-none');
    if (!show) {
        e.addClass('d-none');
    }
}

store.select((s) => s.navigation).subscribe((navigation) => {
    store.setSlice('timer', { started: false });
    let visible;
    const x = (e, v) => {
        e.removeClass('text-primary text-dark').addClass(v ? 'text-primary' : 'text-dark');
    };
    visible = navigation.page === '/scramble';
    setVisible($('#scr-details-scramble'), visible);
    setVisible($('#scr-actions-scramble'), visible);
    x($('#btn-scramble'), visible);
    visible = navigation.page === '/inspect';
    setVisible($('#scr-details-inspect'), visible);
    setVisible($('#scr-actions-inspect'), visible);
    x($('#btn-inspect'), visible);
    visible = navigation.page === '/log';
    setVisible($('#scr-details-log'), visible);
    setVisible($('#scr-actions-log'), visible);
    x($('#btn-log'), visible);
});


store.select((s) => s.timer).subscribe((timer) => {
    const icon = $('#scr-actions-inspect-icon');
    icon.removeClass('fa-play fa-stop');
    if (timer.started) {
        inspectionService.start();
        icon.addClass('fa-stop');
        return;
    }
    inspectionService.stop();
    icon.addClass('fa-play');
});


if (screenfull.isEnabled) {
    screenfull.on('change', () => {
        if (!screenfull.isFullscreen) {
            setVisible($('#app-fullscreen'), true);
            setVisible($('#app'), false);
        }
    });
}
else {
    $('#btn-go-fullscreen').html(`<div class="h1">app NOT supported</div>`);
}

store.setSlice('navigation', { page: '/scramble' });
$('#scr-actions-scramble-create').click();
