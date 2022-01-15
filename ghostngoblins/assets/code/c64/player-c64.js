import { createGhostngoblinsRam } from './ghostngoblins-ram.js';
import { MOS6510 } from '../hardware/mos-6510.js';

/*
class used for automated test only
*/
export class PlayerC64 {
    constructor() {
        this.cpu = new MOS6510(createGhostngoblinsRam(), null);
    }

    init(songIndex) {
        this.cpu.cpuJSR(0x2000, songIndex);
    }

    play() {
        this.cpu.cpuJSR(0x21b1, 0);
    }

    getRegs() {
        return this.cpu.mem.slice(0xd400, 0xd41d);
    }
}
