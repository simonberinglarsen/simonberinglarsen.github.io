import { SidChip } from './sid-chip.js';

export class SampleProvider {
    sid = null;
    playRoutine = null;
    playRoutineHz = 50;
    clock = 0;
    sidRegs = new Array(29).fill(0);

    constructor(sampleRate) {
        this.sid = new SidChip(sampleRate);
    }

    reset() {
        this.clock = 0;
        this.sidRegs = new Array(29).fill(0);
        this.sid.setRegisters(this.sidRegs);
        this.sid.tick();
    }

    tick() {
        const sidAppRate = Math.floor(this.sid.sampleRate / this.playRoutineHz);

        if (this.clock === sidAppRate) {
            if (this.playRoutine) {
                this.sidRegs = this.playRoutine();
                this.clock = 0;
            }
        }
        this.sid.setRegisters(this.sidRegs);
        this.sid.tick();
        this.clock++;
    }

    getNextSample() {
        this.tick();
        return this.sid.output;
    }
}
