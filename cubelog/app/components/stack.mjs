import { Subject } from 'https://dev.jspm.io/rxjs@6/_esm2015';
import { takeUntil } from 'https://dev.jspm.io/rxjs@6/_esm2015/operators';
import { app } from '../app.mjs';

export class StackComponent {
    constructor() {
        this.graphMode = false;
        this.destroy$ = new Subject();
    }

    destroy() {
        this.destroy$.next();
    }

    init() {
        $('#scr-details').empty().html(
            `<div id="scr-details-stack">
            </div>`);
        $('#scr-actions').empty().html(`
            <div class="d-flex flex-row justify-content-around">
                <button class="PLACEHOLDER btn btn-default bg-transparent rounded-circle mx-2" disabled>&nbsp;</button>
                <button id="scr-actions-stack-graph" class="btn btn-default bg-white rounded-circle mx-2">
                <i id="stack-graph-icon" class="fas fa-chart-pie"></i></button>
                <button class="PLACEHOLDER btn btn-default bg-transparent rounded-circle mx-2" disabled>&nbsp;</button>
            </div>`);
        $('#scr-actions-stack-graph').click(() => {
            this.graphMode = !this.graphMode;
            $('#stack-graph-icon')
                .removeClass('far fa-address-card fas fa-chart-pie')
                .addClass(this.graphMode ? 'far fa-address-card' : 'fas fa-chart-pie');
            this.rebuild();
        });
        app.store.setSlice('sessions', { viewed: true });
        this.rebuild();
        app.store.select((s) => s.sessions)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.rebuild();
            });
    }

    buildCards() {
        const sessions = app.store.state.sessions.entries;
        const stackElem = $('#scr-details-stack');
        stackElem.empty();
        sessions.forEach(e => {
            const dateString = new Date(e.key).toISOString().substring(0, 10);
            const timeString = new Date(e.key).toISOString().substring(11, 23);
            const detailsId = `stack-card-${e.key}`;
            const worstTime = Math.max(...e.log.map(item => item.time));
            const bestTime = Math.min(...e.log.map(item => item.time));
            const solveCount = e.log.length;
            stackElem.append(
                `<div class="m-2 mb-5 p-2 bg-secondary rounded text-dark text-mono text-left">
                    <div class="mb-2">
                        <button class="btn btn-default text-dark rounded-circle scr-details-stack-toggle" 
                            data-detailsid="${detailsId}" 
                            data-key="${e.key}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-dark text-secondary rounded-circle scr-details-stack-delete float-right" 
                            data-key="${e.key}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="border-top border-dark bg-dark text-secondary px-2">${dateString} (${timeString})</div>
                    <div class="border-top border-dark">
                        <div>BEST single <span class="font-weight-bold">${bestTime}</span></div>
                        <div>WORST single ${worstTime}</div>
                        <div>TOTAL solves #${solveCount}</div>
                    </div>
                    <div class="border-top border-dark" id="${detailsId}"></div>
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
                        
                        <div class="font-weight-bold">#${i++} ${solve.time}</div>
                        <div class="px-4">${solve.scrambleText}</div>
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

    buildGraph() {
        let points = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 },
            { x: 4, y: 4 },
            { x: 5, y: 4 },
            { x: 6, y: 2 },
        ];
        points = [];
        let avgPoints = [];
        let sum = 0;
        let i = 1;
        const sessions = app.store.state.sessions.entries.sort((a,b) => a.key - b.key);
        sessions.forEach(s => {
            s.log.forEach(l => {
                points.push({
                    x: i,
                    y: l.time
                });
                sum += l.time;
                let avg = sum/i;
                avgPoints.push({
                    x: i,
                    y: avg
                });
                i++;
            });
        });




        const stackElem = $('#scr-details-stack');
        stackElem.empty();
        stackElem.append('<canvas id="chart1"></canvas>');
        var ctx1 = document.getElementById('chart1').getContext('2d');
        var chart = new Chart(ctx1, {
            // The type of chart we want to create
            type: 'scatter',

            // The data for our dataset
            data: {
                datasets: [{
                    label: 'Solves',
                    backgroundColor: 'rgb(80,80,80)',
                    borderColor: 'rgb(255,255,255)',
                    showLine: true,
                    fill: false,
                    data: points
                },
                {
                    label: 'Avg',
                    backgroundColor: 'rgb(80,80,80)',
                    borderColor: 'rgb(0,255,255)',
                    showLine: true,
                    fill: false,
                    data: avgPoints
                }]
            },

            // Configuration options go here
            options: {
                aspectRatio: 1,
            }
        });
    }

    rebuild() {
        if (this.graphMode) {
            this.buildGraph();
        }
        else {
            this.buildCards();
        }


    }
}