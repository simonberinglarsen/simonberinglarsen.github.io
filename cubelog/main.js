var { interval, Subject } = rxjs;
var { map, distinctUntilChanged, takeUntil } = rxjs.operators;

class App {
    constructor() {
        this.debug = false;
        this.notSupported = [];
        if (typeof (Storage) === "undefined") {
            this.notSupported.push('browser storage')
        }
        if (!screenfull.isEnabled) {
            this.notSupported.push('full screen')
        }
    }
    start() {
        if (this.notSupported.length > 0) {
            $('#btn-go-fullscreen').empty();
            this.notSupported.forEach(item => {
                $('#btn-go-fullscreen').append(`<div class="h1">${item}</div>`);
            });
            return;
        }
        screenfull.on('change', () => {
            if (!screenfull.isFullscreen) {
                setVisible($('#app-fullscreen'), true);
                setVisible($('#app'), false);
            }
        });
        store.setSlice('navigation', { page: '/scramble' });
        $('#scr-actions-scramble-create').click();
        if (this.debug) {
            setVisible($('#app-fullscreen'), false);
            setVisible($('#app'), true);
        }
    }
}

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
                $('#scr-details-inspect').removeClass('bg-success bg-warning bg-danger').addClass(color);
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

class LogComponent {
    constructor(log) {
        this.log = log;
        this.tbody = $('#scr-details-log-rows');
    }
    buildRow(i) {
        const ao5 = i < 4 ? '...' :
            Math.floor(this.log.entries
                .slice(i - 4, i + 1)
                .map(e => +e.time)
                .reduce((p, c) => p + c, 0) / 5
            );
        const ao12 = i < 11 ? '...' :
            Math.floor(this.log.entries
                .slice(i - 11, i + 1)
                .map(e => +e.time)
                .reduce((p, c) => p + c, 0) / 12
            );
        const entry = this.log.entries[i];
        this.tbody.append(`<tr data-index="${i}">
            <th scope="row">${i + 1}</th>
            <td>${!entry.time ? '' : entry.time}</td>
            <td>${ao5}</td>
            <td>${ao12}</td>
        </tr>`);
    }
    buildEditRow(i) {
        this.tbody.append(`
        <tr data-index="${i}" class="bg-secondary">
            <td colspan="5">
                <div class="d-flex flex-row justify-content-around">
                    <div class="btn text-dark px-3" id="btn-log-edit">
                        <div><i class="fas fa-pencil-alt"></i></div>
                        <div class="small-text font-weight-bold">edit</div>
                    </div>
                    <div class="btn text-dark px-3" id="btn-log-clone">
                        <div><i class="far fa-clone"></i></div>
                        <div class="small-text font-weight-bold">clone</div>
                    </div>
                    <div class="btn text-dark px-3" id="btn-log-delete">
                        <div><i class="fas fa-trash-alt"></i></div>
                        <div class="small-text font-weight-bold">delete</div>
                    </div>
                </div>
            </td>
        </tr>`);
        $('#btn-log-clone').click(() => {
            const insertAt = store.state.log.selectedIndex;
            const newLog = [...store.state.log.entries];
            const newItem = { ...newLog[insertAt] };
            newLog.splice(insertAt, 0, newItem);
            store.setSlice('log', { entries: newLog, selectedIndex: insertAt + 1 });
        });
        $('#btn-log-edit').click(() => {
            store.setSlice('log', { editActionMode: true });
        });
        $('#btn-log-delete').click(() => {
            const deleteAt = store.state.log.selectedIndex;
            const newLog = [...store.state.log.entries];
            newLog.splice(deleteAt, 1);
            store.setSlice('log', { entries: newLog, editActionMode: false, selectedIndex: -1 });
        });
    }
    buildActionRow(i) {
        let defaultValue = store.state.log.entries[store.state.log.selectedIndex].time;
        if (!defaultValue) {
            defaultValue = '';
        }
        this.tbody.append(`
        <tr data-index="${i}" class="bg-secondary">
            <td colspan="5">
                <div class="input-group">
                    <input id="input-edit" 
                        value="${defaultValue}" 
                        data-index="${i}" type="number" 
                        class="form-control large-text font-weight-bold">
                    <div class="input-group-append">
                        <div class="btn text-dark mx-2" id="btn-edit-apply">
                            <div><i class="fas fa-check-circle fa-2x"></i></div>
                            <div class="small-text font-weight-bold">Apply</div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>`);
        $('#input-edit').focus();
        $('#input-edit').keypress(function (e) {
            var key = e.which;
            if (key == 13) {
                $('#btn-edit-apply').click();
                return false;
            }
        });
        $('#btn-edit-apply').click(() => {
            const inputEdit = $('#input-edit');
            const index = inputEdit.data('index');
            const newLog = [...store.state.log.entries];
            newLog[index].time = inputEdit.val() ? +inputEdit.val() : 0;
            store.setSlice('log', { entries: newLog, editActionMode: false, selectedIndex: -1 });

        });
    }
    buildSelectedRow(i) {
        const isActionMode = store.state.log.editActionMode;
        if (isActionMode) {
            this.buildActionRow(i);
        }
        else {
            this.buildEditRow(i);
        }
    }
    registerRowClick() {
        $("#scr-details-log-rows tr").on("click", (e) => {
            let selectedIndex = $(e.currentTarget).data('index');
            if (selectedIndex === store.state.log.selectedIndex) {
                return;
            }
            if (store.state.log.selectedIndex !== -1) {
                store.setSlice('log', { editActionMode: false, selectedIndex: -1 });
                return;
            }
            store.setSlice('log', { editActionMode: false, selectedIndex: selectedIndex });
        });
    }
    rebuild() {
        this.tbody.empty();
        for (let i = this.log.entries.length - 1; i >= 0; i--) {
            const rowIsSelected = (i == store.state.log.selectedIndex);
            if (rowIsSelected) {
                this.buildSelectedRow(i);
            }
            else {
                this.buildRow(i);
            }
        }
        this.registerRowClick();
    }
}

class BusinessLogicService {
    getScramble() {
        let moves = [];
        let last = '';
        let rnd = (x) => x[Math.floor(Math.random() * x.length)];
        for (let i = 0; i < 25; i++) {
            let faces = ['R', 'L', 'F', 'B', 'U', 'D'];
            faces = faces.filter(f => f !== last);
            last = rnd(faces);
            let direction = ['\'', '2', ''];
            moves.push(`${last}${rnd(direction)}`);
        }
        return moves;
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
            },
            log: {
                entries: [],
                selectedIndex: -1,
                editActionMode: false
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
const businessLogicService = new BusinessLogicService();
const inspectionService = new InspectionService();

$('#scr-actions-log-create').click(() => {
    addEmptyLogEntry();
});
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
    $('#scr-details-scramble-text').html(`${
        businessLogicService.getScramble()
            .map(m => `<span class="text-warning mono-text large-text mr-3">${m}</span>`)
            .join(' ')
        }`);
});
$('#scr-actions-scramble-forward').click(() => {
    store.setSlice('navigation', { page: '/inspect' });
});
$('#scr-actions-inspect-forward').click(() => {
    store.setSlice('navigation', { page: '/log' });
    addEmptyLogEntry();
});
$('#scr-actions-inspect-forward').click(() => {
    store.setSlice('navigation', { page: '/log' });
});
$('#scr-actions-log-forward').click(() => {
    store.setSlice('navigation', { page: '/scramble' });
});
$('#scr-actions-log-archive').click(() => {
    alert('select archive');
});

$('#scr-actions-inspect-play').click(() => {
    store.setSlice('timer', { started: !store.state.timer.started });
});
$('#btn-go-fullscreen').click(() => {
    screenfull.request();
    setVisible($('#app-fullscreen'), false);
    setVisible($('#app'), true);
});

function addEmptyLogEntry() {
    const newLog = [...store.state.log.entries];
    if (newLog.length === 0 || newLog[newLog.length - 1].time) {
        newLog.push({ time: 0 });
        store.setSlice('log', { entries: newLog, editActionMode: true, selectedIndex: newLog.length - 1 });
    }
}

function setVisible(e, show) {
    e.removeClass('d-none');
    if (!show) {
        e.addClass('d-none');
    }
}

store.select((s) => s.log).subscribe((log) => {
    const logComponent = new LogComponent(log);
    logComponent.rebuild();
});

store.select((s) => s.navigation).subscribe((navigation) => {
    store.setSlice('timer', { started: false });
    let visible;
    const x = (e, v) => {
        e.removeClass('text-primary text-dark small-text').addClass(v ? 'text-primary' : 'text-dark small-text');
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

const app = new App();
app.debug = false;
app.start();
