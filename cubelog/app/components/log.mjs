import { Subject } from 'https://dev.jspm.io/rxjs@6/_esm2015';
import { takeUntil } from 'https://dev.jspm.io/rxjs@6/_esm2015/operators';
import { app } from '../app.mjs';

export class LogComponent {
    constructor(log) {
        this.log = log;
        this.destroy$ = new Subject();
    }

    destroy() {
        this.destroy$.next();
    }

    init() {
        $('#scr-details').empty().html(`
            <div id="scr-details-log">
                <table class="table table-dark" id="table-log">
                    <thead>
                        <tr>
                            <th class="text-danger" scope="col">#</th>
                            <th class="text-success" scope="col">Time</th>
                            <th class="text-warning" scope="col">Ao5</th>
                            <th class="text-info" scope="col">Ao12</th>
                        </tr>
                    </thead>
                    <tbody id="scr-details-log-rows">
                    </tbody>
                </table>
                <button id="scr-actions-log-save" class="btn btn-default text-dark rounded-circle mx-2">
                <i class="fas fa-save fa-2x m-2"></i></button>
            </div>`);
        $('#scr-actions').empty().html(`
            <div class="d-flex flex-row justify-content-around">
                <button id="scr-actions-log-create" class="btn btn-default bg-white rounded-circle mx-2">
                    <i class="fas fa-plus"></i></button>
                <button id="scr-actions-log-forward" class="btn btn-default bg-white rounded-circle mx-2">
                    <i class="fas fa-forward"></i></button>
                <button class="PLACEHOLDER btn btn-default bg-transparent rounded-circle mx-2" disabled>
                    &nbsp;</button>
            </div>`);
        $('#scr-actions-log-save').click(() => {
            app.store.saveLog();
        });
        $('#scr-actions-log-forward').click(() => {
            app.store.setSlice('navigation', { page: '/scramble' });
        });
        $('#scr-actions-log-create').click(() => {
            app.store.addEmptyLogEntry();
        });
        this.rebuild();

        app.store.select((s) => s.log)
            .pipe(takeUntil(this.destroy$))
            .subscribe((log) => {
                this.log = log;
                this.rebuild();
            });
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
        const entry = this.log.entries[i];
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
                    <div class="btn text-dark px-3" id="btn-log-cancel">
                        <div><i class="fas fa-times"></i></div>
                        <div class="small-text font-weight-bold">cancel</div>
                    </div>
                </div>
                <div class="bg-dark text-mono text-secondary p-2 rounded">
                    ${entry.scrambleText}
                </div>
            </td>
        </tr>`);
        $('#btn-log-clone').click(() => {
            const insertAt = app.store.state.log.selectedIndex;
            const newLog = [...app.store.state.log.entries];
            const newItem = { ...newLog[insertAt] };
            newLog.splice(insertAt, 0, newItem);
            app.store.setSlice('log', { entries: newLog, selectedIndex: insertAt + 1 });
        });
        $('#btn-log-cancel').click(() => {
            app.store.setSlice('log', { editActionMode: false, selectedIndex: -1 });
        });
        $('#btn-log-edit').click(() => {
            app.store.setSlice('log', { editActionMode: true });
        });
        $('#btn-log-delete').click(() => {
            const deleteAt = app.store.state.log.selectedIndex;
            const newLog = [...app.store.state.log.entries];
            newLog.splice(deleteAt, 1);
            app.store.setSlice('log', { entries: newLog, editActionMode: false, selectedIndex: -1 });
        });
    }
    buildActionRow(i) {
        let defaultValue = app.store.state.log.entries[app.store.state.log.selectedIndex].time;
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
            const newLog = [...app.store.state.log.entries];
            newLog[index].time = inputEdit.val() ? +inputEdit.val() : 0;
            newLog[index].scrambleText = app.store.state.scramble.text;
            app.store.setSlice('log', { entries: newLog, editActionMode: false, selectedIndex: -1 });

        });
    }
    buildSelectedRow(i) {
        const isActionMode = app.store.state.log.editActionMode;
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
            if (selectedIndex === app.store.state.log.selectedIndex) {
                return;
            }
            if (app.store.state.log.selectedIndex !== -1) {
                app.store.setSlice('log', { editActionMode: false, selectedIndex: -1 });
                return;
            }
            app.store.setSlice('log', { editActionMode: false, selectedIndex: selectedIndex });
        });
    }
    rebuild() {
        $('#scr-actions-log-save').prop( "disabled", this.log.entries.length === 0 );
        this.tbody = $('#scr-details-log-rows');
        this.tbody.empty();
        for (let i = this.log.entries.length - 1; i >= 0; i--) {
            const rowIsSelected = (i == app.store.state.log.selectedIndex);
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