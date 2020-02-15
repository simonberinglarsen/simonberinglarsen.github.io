import { Subject } from 'https://dev.jspm.io/rxjs@6/_esm2015';
import { app } from '../app.mjs';

export class ScrambleComponent {
    constructor() {
        this.destroy$ = new Subject();
    }

    destroy() {
        this.destroy$.next();
    }

    init() {
        $('#scr-details').empty().html(`
            <div id="scr-details-scramble">
                <div id="scr-details-scramble-text"></div>
            </div>
        `);
        $('#scr-actions').empty().html(`
            <button id="scr-actions-scramble-create" class="btn btn-default bg-white rounded-circle mx-2">
                <i class="fas fa-redo"></i></button>
            <button id="scr-actions-scramble-forward" class="btn btn-default bg-white rounded-circle mx-2">
                <i class="fas fa-forward"></i></button>
        `);
        $('#scr-actions-scramble-create').click(() => {
            const scrambleText = this.getScramble()
                .map(m => `<span class="text-warning mono-text large-text mr-3">${m}</span>`)
                .join(' ');
            $('#scr-details-scramble-text').html(`${scrambleText}`);
        });
        $('#scr-actions-scramble-forward').click(() => {
            app.store.setSlice('navigation', { page: '/inspect' });
        });

        $('#scr-actions-scramble-create').click();
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