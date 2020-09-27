class Piece {
    constructor(id, text) {
        this.id = id;
        this.data = [];
        this.variants = [];
        this.width = 0;
        this.height = 0;

        if (text) {
            this.loadFromText(text);
        }
    }

    loadFromText(text) {
        const lines = text.split(/\r|\n/).map(l => l.trim()).filter(l => !!l);
        this.width = lines[0].length;
        this.height = lines.length;
        let i = 0;
        lines.forEach(line => {
            line.split('').forEach(ch => {
                this.data.push(ch === '.' ? 0 : 1);
            });
        });


        this.saveAsVariant();

        this.rotate();
        this.saveAsVariant();

        this.rotate();
        this.saveAsVariant();

        this.rotate();
        this.saveAsVariant();

        this.rotate();
        this.mirror();
        this.saveAsVariant();

        this.rotate();
        this.saveAsVariant();

        this.rotate();
        this.saveAsVariant();

        this.rotate();
        this.saveAsVariant();

        this.rotate();
        this.mirror();
    }

    getData(x, y) {
        if (x < 0 || x >= this.width) {
            return 0;
        }
        if (y < 0 || y >= this.height) {
            return 0;
        }
        return this.data[x + y * this.width];
    }

    rotate() {
        const tmp = [...this.data];
        const height = this.height;
        const width = this.width;
        let i = 0;
        for (let x = height - 1; x >= 0; x--) {
            for (let y = 0; y < width; y++) {
                const q = x + height * y;
                tmp[x + height * y] = this.data[i];
                i++;
            }
        }
        this.data = tmp;
        this.height = width;
        this.width = height;
    }

    mirror() {
        const tmp = [...this.data];
        const height = this.height;
        const width = this.width;
        let i = 0;
        for (let y = 0; y < height; y++) {
            for (let x = width - 1; x >= 0; x--) {
                tmp[x + width * y] = this.data[i];
                i++;
            }
        }
        this.data = tmp;
    }

    saveAsVariant() {
        const newPiece = new Piece(this.id);
        newPiece.data = [...this.data];
        newPiece.width = this.width;
        newPiece.height = this.height;

        let exists = this.variants.find(v => {
            if (v.width !== newPiece.width) {
                return false;
            }
            if (v.height !== newPiece.height) {
                return false;
            }
            for (let i = 0; i < newPiece.data.length; i++) {
                if (newPiece.data[i] !== v.data[i]) {
                    return false;
                }
            }
            return true;
        });

        if (!exists) {
            this.variants.push(newPiece);
        }
    }
}

class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Array(this.width * this.height).fill(0);
    }

    debug() {
        for (let y = 0; y < this.height; y++) {
            let line = '';
            for (let x = 0; x < this.width; x++) {
                const d = this.getData(x, y);
                line += d === 0 ? '.' : String.fromCharCode(d + 65);;
            }
            console.log(line);
        }
        console.log('');

    }

    clear() {
        this.data.fill(0);
    }

    tryAddPiece(piece, x, y) {
        if (this.addPiece(piece, piece.id, x, y, false)) {
            this.addPiece(piece, piece.id, x, y, true);
            return true;
        }
        return false;
    }

    undoPiece(piece, x, y) {
        this.addPiece(piece, 0, x, y, true);
    }

    addPiece(piece, id, x, y, commitPiece) {
        for (let px = 0; px < piece.width; px++) {
            for (let py = 0; py < piece.height; py++) {
                if (piece.getData(px, py) <= 0) {
                    continue;
                }
                if (id !== 0) {
                    const existingData = this.getData(x + px, y + py);
                    const outOfBounds = existingData < 0;
                    if (outOfBounds) {
                        return false;
                    }
                    const occupied = existingData > 0;
                    if (occupied) {
                        return false;
                    }
                    if (!commitPiece) {
                        continue;
                    }
                }
                this.setData(x + px, y + py, id);
            }
        }
        return true;
    }

    getData(x, y) {
        if (x < 0 || x >= this.width) {
            return -1;
        }
        if (y < 0 || y >= this.height) {
            return -1;
        }
        return this.data[x + y * this.width];
    }

    setData(x, y, id) {
        if (x < 0 || x >= this.width) {
            throw new Error('out of bounds');
        }
        if (y < 0 || y >= this.height) {
            throw new Error('out of bounds');
        }
        this.data[x + y * this.width] = id;
    }

    solved() {
        return !this.data.find(d => d === 0);
    }


}

class Renderer {
    constructor(board) {
        this.fieldSize = 60;
        this.board = board;
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.fieldSize * this.board.width;
        this.canvas.height = this.fieldSize * this.board.height;
        this.ctx = canvas.getContext('2d');
    }

    render() {
        const fieldSize = this.fieldSize;

        const colors = [
            '#000000',
            '#222034',
            '#45283C',
            '#663931',
            '#8F563B',
            '#DF7126',
            '#D9A066',
            '#EEC39A',
            '#FBF236',
            '#99E550',
            '#6ABE30',
            '#37946E',
            '#4B692F',
            '#524B24',
            '#323C39',
            '#3F3F74',
            '#306082',
            '#5B6EE1',
            '#639BFF',
            '#5FCDE4',
            '#CBDBFC',
            '#FFFFFF',
            '#9BADB7',
            '#847E87',
            '#696A6A',
            '#595652',
            '#76428A',
            '#AC3232',
            '#D95763',
            '#D77BBA',
            '#8F974A',
            '#8A6F30',


        ];
        const ctx = this.ctx;
        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x < this.board.width; x++) {
                ctx.fillStyle = colors[this.board.getData(x, y)*2];
                ctx.fillRect(x * fieldSize, y * fieldSize, fieldSize, fieldSize);
                ctx.strokeStyle = colors[0];
                ctx.strokeRect(x * fieldSize, y * fieldSize, fieldSize, fieldSize);
            }
        }
    }
}

export class App {
    constructor() {
        this.board = new Board(7, 5);
        this.renderer = new Renderer(this.board);
    }

    run() {
        let pieceId = 1;
        const pieces = [
            new Piece(pieceId++, `
            XXX
            `),
            new Piece(pieceId++, `
            X.
            X.
            XX
            `),
            new Piece(pieceId++, `
            XX
            X.
            XX
            `),
            new Piece(pieceId++, `
            .X.
            XXX
            .X.
            `),
            new Piece(pieceId++, `
            XXX
            X..
            X..
            `),
            new Piece(pieceId++, `
            XXXXX
            `),
            new Piece(pieceId++, `
            XXXXX
            ..X.X
            ..X..
            `),

        ];
        const stackOfPieces = [...pieces];

        stackOfPieces.forEach(p => {
            p.variants.forEach((v, i) => {
                const btn = $(`<button class="btn-test">${p.id}.${i}</button>`);
                btn.click(() => {
                    this.board.clear();
                    this.board.tryAddPiece(v, 0, 0);
                    this.renderer.render();
                });
                $('.right').append(btn);

            });
            
        })
        this.renderer.render();
        const solutions = [];
        this.solve(stackOfPieces, solutions);
        if(solutions.length === 0) {
            console.log('no solutions');
        }
        solutions.forEach((s,i) => {
            const btn = $(`<button class="btn-test">res-${i}</button>`);
            btn.click(() => {
                this.board.clear();
                this.board.data = [...s];
                this.renderer.render();
            });
            $('.left').append(btn);
        });


        

        this.renderer.render();
    }

    solve(stackOfPieces, solutions) {
        if (stackOfPieces.length === 0) {
            solutions.push([...this.board.data]);
            this.board.debug();
            return true;
        }

        const orgPiece = stackOfPieces.pop();
        const trySolve = (piece) => {
            const w = this.board.width - piece.width;
            const h = this.board.height - piece.height;
            for (let y = 0; y <= h; y++) {
                for (let x = 0; x <= w; x++) {
                    if (this.board.tryAddPiece(piece, x, y)) {
                        if (this.solve(stackOfPieces, solutions)) {
                            //return true;
                        }
                        this.board.undoPiece(piece, x, y)
                    }
                }
            }
        }
        for (let i = 0; i < orgPiece.variants.length; i++) {
            const variant = orgPiece.variants[i];
            if (trySolve(variant)) {
                return true;
            }
        }

        stackOfPieces.push(orgPiece);
        return false;

    }
}