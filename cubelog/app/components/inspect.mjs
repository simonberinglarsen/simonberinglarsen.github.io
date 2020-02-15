import { app } from '../app.mjs'
import { Subject, interval } from 'https://dev.jspm.io/rxjs@6/_esm2015';
import { takeUntil } from 'https://dev.jspm.io/rxjs@6/_esm2015/operators';

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
                $('#scr-details-inspect').removeClass('bg-info bg-success bg-warning bg-danger').addClass(color);
                $('#scr-details-inspect-text').html(this.elapsed);
            });
    }
    stop() {
        this.destroy$.next();
        this.calcElapsed();
        this.started = false;
    }
    destroy() {
        this.destroy$.next();
    }
    calcElapsed() {
        this.elapsed = Math.floor((new Date() - this.startTime) / 1000);
    }
}

export class InspectComponent {
    constructor() {
        this.destroy$ = new Subject();
        this.inspectionService = new InspectionService();
    }

    destroy() {
        this.destroy$.next();
        this.inspectionService.destroy();
    }

    init() {
        $('#scr-details').empty().html(`
            <div id="scr-details-inspect" class="bg-info">
                <div class="mt-4">
                    <span id="scr-details-inspect-text"
                        class="rounded text-center text-dark display-1 font-weight-bold p-3">press play</span>
                </div>
            </div>`);
        $('#scr-actions').empty().html(`
            <div id="scr-actions-inspect">
                <button id="scr-actions-inspect-play" class="btn btn-default bg-white rounded-circle mx-2">
                    <i id="scr-actions-inspect-icon" class="fas fa-play"></i></button>
                <button id="scr-actions-inspect-forward" class="btn btn-default bg-white rounded-circle mx-2">
                    <i class="fas fa-forward"></i></button>
            </div>`);

        $('#scr-actions-inspect-play').click(() => {
            app.store.setSlice('timer', { started: !app.store.state.timer.started });
        });
        $('#scr-actions-inspect-forward').click(() => {
            app.store.setSlice('navigation', { page: '/log' });
            app.store.addEmptyLogEntry();
        });
        app.store.select((s) => s.timer)
            .pipe(takeUntil(this.destroy$))
            .subscribe((timer) => {
                const icon = $('#scr-actions-inspect-icon');
                icon.removeClass('fa-play fa-stop');
                if (timer.started) {
                    this.inspectionService.start();
                    icon.addClass('fa-stop');
                    return;
                }
                this.inspectionService.stop();
                icon.addClass('fa-play');
            });
    }
}