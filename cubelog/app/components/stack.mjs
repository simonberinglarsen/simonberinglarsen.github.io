import { Subject } from 'https://dev.jspm.io/rxjs@6/_esm2015';
import { takeUntil } from 'https://dev.jspm.io/rxjs@6/_esm2015/operators';
import { app } from '../app.mjs';

export class StackComponent {
    constructor() {
        this.destroy$ = new Subject();
    }

    destroy() {
        this.destroy$.next();
    }

    init() {
        $('#scr-details').empty().html(
            `<div id="scr-details-stack"></div>`);
        $('#scr-actions').empty().html(
            `<button class="btn btn-default bg-transparent rounded-circle mx-2">
            <i class="fas fa-plus"></i></button>`);
        app.store.setSlice('sessions', { viewed: true });
        this.rebuild();
        app.store.select((s) => s.sessions)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.rebuild();
            });
    }

    rebuild() {
        const sessions = app.store.state.sessions.entries;
        const stackElem = $('#scr-details-stack');
        stackElem.empty();
        sessions.forEach(e => {
            const dateString = new Date(e.key).toISOString().substring(0, 10);
            const timeString = new Date(e.key).toISOString().substring(11, 23);
            const detailsId = `stack-card-${e.key}`;
            const worstTime = Math.max(...e.log.map(item => item.time));
            const bestTime = Math.min(...e.log.map(item => item.time));
            stackElem.append(
                `<div class="m-2 mb-5 p-2 bg-secondary rounded text-dark text-mono text-left">
                    <div class="h4 pb-4">${dateString} (${timeString})
                        <button class="btn btn-outline-dark text-dark rounded-circle float-right scr-details-stack-toggle" 
                                    data-detailsid="${detailsId}" 
                                    data-key="${e.key}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-outline-dark text-dark rounded-circle mr-4 float-right scr-details-stack-delete" 
                            data-key="${e.key}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="row border-top border-dark">
                        <div class="col-6">
                            <div class="row"><div class="col-8">BEST single</div><div class="col-4 font-weight-bold">${bestTime}</div></div>
                        </div>
                        <div class="col-6 border-left border-dark">
                            <div class="row"><div class="col-8">WORST single</div><div class="col-4">${worstTime}</div></div>
                        </div>
                    </div>
                    <div id="${detailsId}"></div>
                </div>`);
        });
        $('.scr-details-stack-delete').click((e) => {
            const buttonElem = $(e.currentTarget);
            const key = buttonElem.data('key');
            app.store.deleteLog(key);
        });
        $('.scr-details-stack-toggle').click((e) => {
            const buttonElem = $(e.currentTarget);
            const iconElem = buttonElem.children(":first");
            const detailsId = buttonElem.data('detailsid');
            const detailsElem = $(`#${detailsId}`);
            const openLogNow = detailsElem.is(':empty');
            if (openLogNow) {
                const key = buttonElem.data('key');
                const session = sessions.find(s => s.key === key);
                detailsElem.empty();
                let i = 1;
                session.log.forEach(solve => {
                    detailsElem.append(`
                        <div class="row border-top border-dark">
                            <div class="col-1">
                                #${i++}
                            </div>
                            <div class="col-3">
                                ${solve.time}
                            </div>
                            <div class="col-8">
                                ${solve.scrambleText}
                            </div>
                        </div>
                    
                    `);
                });
                iconElem.removeClass('fa-plus fa-minus').addClass('fa-minus');
            }
            else {
                detailsElem.empty();
                iconElem.removeClass('fa-plus fa-minus').addClass('fa-plus');
            }
        });

    }
}