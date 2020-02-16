import { LogComponent } from './components/log.mjs';
import { InspectComponent } from './components/inspect.mjs';
import { ScrambleComponent } from './components/scramble.mjs';
import { StackComponent } from './components/stack.mjs';
import { Store } from './store.mjs';

export class App {
    ctor() {
        this.fullScreen = false;
        this.detailsComponent = null;
        this.store = new Store();
        this.store.loadFromDatabase();
        this.notSupported = [];
        if (typeof (Storage) === "undefined") {
            this.notSupported.push('browser storage')
        }
        if (!screenfull.isEnabled) {
            this.notSupported.push('full screen')
        }
    }
    rebuild() {
        if (!this.fullScreen) {
            $('#main').empty().html(
                `<div id="app-fullscreen" class="app fullscreen text-center">
                    <div class="m-4">
                        <div class="btn text-dark mx-2" id="btn-go-fullscreen">
                            <div><i class="fas fa-expand-arrows-alt fa-4x"></i></div>
                            <div class="font-weight-bold">GO FULLSCREEN</div>
                        </div>
                    </div>
                </div>`);
            $('#btn-go-fullscreen').click(() => {
                screenfull.request();
            });
        }
        if (this.fullScreen) {
            $('#main').empty().html(
                `<div id="app" class="app d-flex flex-column h100">
                    <div id="scr-details" class="flex-1 bg-dark text-light p-2 text-center w-100 scrollbar"></div>
                    <div id="scr-actions" class="bg-black p-2"></div>
                    <div id="scr-statusbar" class="bg-light p-2 text-center">
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
                                <div><i class="far fa-edit"></i><span id="btn-log-notify" class="badge badge-danger d-none">!</span></div>
                                <div class="small-text font-weight-bold">log</div>
                            </div>
                            <div class="text-dark mx-2" id="btn-stack">
                                <div><i class="fas fa-layer-group"></i><span id="btn-stack-notify" class="badge badge-danger d-none">!</span></div>
                                <div class="small-text font-weight-bold">stack</div>
                            </div>
                        </div>
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
            $('#btn-stack').click(() => {
                this.store.setSlice('navigation', { page: '/stack' });
            });
        }
    }
    init() {
        this.rebuild();
        this.store.select((s) => s.log).subscribe((log) => {
            const notifyElem = $('#btn-log-notify');
            notifyElem.removeClass('d-none');
            if(log.entries.length === 0) {
                notifyElem.addClass('d-none');
            }
        });
        
        this.store.select((s) => s.sessions).subscribe((sessions) => {
            const notifyElem = $('#btn-stack-notify');
            notifyElem.removeClass('d-none');
            if(sessions.viewed) {
                notifyElem.addClass('d-none');
            }
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
            x($('#btn-stack'), false);
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
            else if (navigation.page === '/stack') {
                this.detailsComponent = new StackComponent(this.store.state.sessions);
                x($('#btn-stack'), true);
            }
            this.detailsComponent.init();
        });

        if (this.notSupported.length > 0) {
            $('#btn-go-fullscreen').empty();
            this.notSupported.forEach(item => {
                $('#btn-go-fullscreen').append(`<div class="h1">${item}</div>`);
            });
            return;
        }
        screenfull.on('change', () => {
            this.fullScreen = screenfull.isFullscreen;
            this.rebuild();
            this.store.setSlice('navigation', { page: '/scramble' });
        });
        this.store.setSlice('navigation', { page: '/scramble' });
    }

    start() {
        this.ctor();
        this.init();
    }

    setVisible(e, show) {
        e.removeClass('d-none');
        if (!show) {
            e.addClass('d-none');
        }
    }
}

export const app = new App();

