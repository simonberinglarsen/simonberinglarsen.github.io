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


