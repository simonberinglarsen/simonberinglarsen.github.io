import { Subject } from 'https://dev.jspm.io/rxjs@6/_esm2015';
import { map, distinctUntilChanged } from 'https://dev.jspm.io/rxjs@6/_esm2015/operators';

export class Store {
    constructor() {
        this.state$ = new Subject();
        this.state = {
            navigation: {
                page: '',
            },
            timer: {
                started: false
            },
            scramble: {
                text: ''
            },
            log: {
                entries: [],
                selectedIndex: -1,
                editActionMode: false
            },
            sessions: {
                entries: [],
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

    addEmptyLogEntry() {
        const newLog = [...this.state.log.entries];
        if (newLog.length === 0 || newLog[newLog.length - 1].time) {
            newLog.push({ time: 0, scrambleText: this.state.scramble.text });
            this.setSlice('log', { entries: newLog, editActionMode: true, selectedIndex: newLog.length - 1 });
        }
    }

    saveLog() {
        const log = [...this.state.log.entries];
        const logs = [...this.state.sessions.entries];
        logs.push({
            key: new Date().getTime(),
            log: log
        });
        this.setSlice('sessions', { entries: logs });
        this.setSlice('log', { entries: [], editActionMode: false, selectedIndex: - 1 });
        this.storeInDatabase();
    }

    deleteLog(key) {
        const logs = [...this.state.sessions.entries].filter(e => e.key !== key);
        this.setSlice('sessions', { entries: logs });
        this.storeInDatabase();
    }

    loadFromDatabase() {
        if (localStorage.getItem('sessions')) {
            this.state.sessions = JSON.parse(localStorage.getItem('sessions'));
        }
    }

    storeInDatabase() {
        localStorage.setItem('sessions', JSON.stringify(this.state.sessions));
    }
}
