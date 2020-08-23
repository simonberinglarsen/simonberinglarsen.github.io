import { BS_COORDS } from './BS_coords.mjs';
import { DR_COORDS } from './Dr_coords.mjs';
import { TOPOLOGY } from './topology_file.mjs';

export class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.ctx = canvas.getContext('2d');

        this.baseStations = BS_COORDS.trim()
            .split('\n')
            .map(line => {
                let items = line.trim().split(' ');
                return { x: +items[0], y: +items[1] };
            });

        this.drivers = DR_COORDS.trim()
            .split('\n')
            .map(line => {
                let items = line.trim().split(' ');
                return { x: +items[0], y: +items[1] };
            });

        this.adjMatrix = new Array(this.baseStations.length).fill(Infinity).map(() => new Array(this.baseStations.length).fill(Infinity));


        TOPOLOGY.trim()
            .split('\n')
            .map(line => {
                let items = line.trim().split(' ');
                let {a,b,w} = { a: +items[0], b: +items[1], w: +items[2] };
                this.adjMatrix[a][b] = w;
                this.adjMatrix[b][a] = w;
            });
    }

    main() {
        this.clear();
        this.plotBaseStations();
        this.plotDrivers();
    }

    clear() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    }

    plotBaseStations() {
        const r = 2;
        this.baseStations.forEach(p => {
            this.ctx.fillStyle = 'red';
            this.ctx.beginPath();
            this.ctx.ellipse(p.x, p.y, r, r, 0, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    plotDrivers() {
        const r = 1;
        this.drivers.forEach(p => {
            this.ctx.fillStyle = 'black';
            this.ctx.beginPath();
            this.ctx.ellipse(p.x, p.y, r, r, 0, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

}