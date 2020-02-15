import { LogComponent } from './components/log.mjs';
import { InspectComponent } from './components/inspect.mjs';
import { ScrambleComponent } from './components/scramble.mjs';

import { Store } from './store.mjs';

export class App {
    init() {
        $('#scr-statusbar').empty().html(`
            <div class="d-flex flex-row justify-content-around">
                <div class="text-dark mx-2" id="btn-scramble">
                    <div><i class="fas fa-cube"></i></div>
                    <div class="small-text font-weight-bold">scramble</div>
                </div>
                <div class="text-dark mx-2" id="btn-inspect">
                    <div><i class="fas fa-glasses"></i></div>
                    <div class="small-text font-weight-bold">inspect</div>
                </div>
                <div class="text-dark mx-2" id="btn-log">
                    <div><i class="far fa-edit"></i></div>
                    <div class="small-text font-weight-bold">log</div>
                </div>
            </div>`);
        $('#btn-scramble').click(() => {
            this.store.setSlice('navigation', { page: '/scramble' });
        });
        $('#btn-inspect').click(() => {
            this.store.setSlice('navigation', { page: '/inspect' });
        });
        $('#btn-log').click(() => {
            this.store.setSlice('navigation', { page: '/log' });
        });

        $('#btn-go-fullscreen').click(() => {
            screenfull.request();
            this.setVisible($('#app-fullscreen'), false);
            this.setVisible($('#app'), true);
        });

        this.store.select((s) => s.navigation).subscribe((navigation) => {
            if (this.detailsComponent) {
                this.detailsComponent.destroy();
            }
            const x = (e, v) => {
                e.removeClass('text-primary text-dark small-text').addClass(v ? 'text-primary' : 'text-dark small-text');
            };
            x($('#btn-scramble'), false);
            x($('#btn-inspect'), false);
            x($('#btn-log'), false);
            if (navigation.page === '/scramble') {
                this.detailsComponent = new ScrambleComponent();
                x($('#btn-scramble'), true);
            }
            else if (navigation.page === '/inspect') {
                this.detailsComponent = new InspectComponent();
                x($('#btn-inspect'), true);
            }
            else if (navigation.page === '/log') {
                this.detailsComponent = new LogComponent(this.store.state.log);
                x($('#btn-log'), true);
            }
            this.detailsComponent.init();
        });
    }

    start() {
        this.store = new Store();
        this.debug = false;
        this.init();

        this.notSupported = [];
        if (typeof (Storage) === "undefined") {
            this.notSupported.push('browser storage')
        }
        if (!screenfull.isEnabled) {
            this.notSupported.push('full screen')
        }

        if (this.notSupported.length > 0) {
            $('#btn-go-fullscreen').empty();
            this.notSupported.forEach(item => {
                $('#btn-go-fullscreen').append(`<div class="h1">${item}</div>`);
            });
            return;
        }
        screenfull.on('change', () => {
            if (!screenfull.isFullscreen) {
                this.setVisible($('#app-fullscreen'), true);
                this.setVisible($('#app'), false);
            }
        });
        this.store.setSlice('navigation', { page: '/scramble' });
        $('#scr-actions-scramble-create').click();
        if (this.debug) {
            this.setVisible($('#app-fullscreen'), false);
            this.setVisible($('#app'), true);
        }
    }

    setVisible(e, show) {
        e.removeClass('d-none');
        if (!show) {
            e.addClass('d-none');
        }
    }
}

export const app = new App();

