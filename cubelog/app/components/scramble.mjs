import { Subject } from 'https://dev.jspm.io/rxjs@6/_esm2015';
import { takeUntil } from 'https://dev.jspm.io/rxjs@6/_esm2015/operators';
import { app } from '../app.mjs';

export class ScrambleComponent {
    constructor() {
        this.destroy$ = new Subject();
    }

    destroy() {
        this.destroy$.next();
    }

    init() {
        const scrambleText = app.store.state.scramble.text;
        $('#scr-details').empty().html(`
        <div id="scr-details-reuse" class="bg-warning rounded m-2 font-weight-bold display-4 text-dark">reused scramble</div>
        <div id="scr-details-scramble-text">${this.formatScramble(scrambleText)}</div>
        `);
        $('#scr-actions').empty().html(`
            <div class="d-flex flex-row justify-content-around">
                <button id="scr-actions-scramble-create" class="btn btn-default bg-white rounded-circle mx-2">
                    <i class="fas fa-redo"></i></button>
                <button id="scr-actions-scramble-forward" class="btn btn-default bg-white rounded-circle mx-2">
                    <i class="fas fa-forward"></i></button>
                <button class="PLACEHOLDER btn btn-default bg-transparent rounded-circle mx-2" disabled>
                    &nbsp;</button>
            </div>`);
        $('#scr-actions-scramble-create').click(() => {
            const scrambleRaw = this.getScramble();
            app.store.setSlice('scramble', { text: scrambleRaw.join(' ') });

        });
        $('#scr-actions-scramble-forward').click(() => {
            app.store.setSlice('navigation', { page: '/inspect' });
        });
        app.store.select((s) => s.scramble)
            .pipe(takeUntil(this.destroy$))
            .subscribe((scramble) => {
                $('#scr-details-scramble-text').html(`${this.formatScramble(scramble.text)}`);
                $('#scr-details-reuse').removeClass('d-none').addClass('d-none');
            });
        if (!scrambleText) {
            $('#scr-actions-scramble-create').click();
        }
    }

    formatScramble(text) {
        const scrambleText = text
            .split(' ')
            .map(m => `<span class="text-warning text-mono large-text mr-3">${m}</span>`)
            .join(' ');
        return scrambleText;
    }

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