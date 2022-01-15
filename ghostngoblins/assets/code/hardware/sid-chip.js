import { Oscillator } from './oscillator.js';

export class SidChip {
    constructor(sampleRate) {
        this.sampleRate = sampleRate;
        this.masterVolume = 0;
        this.output = 0;

        this.osc = [
            new Oscillator(sampleRate),
            new Oscillator(sampleRate),
            new Oscillator(sampleRate),
        ];

        this.registers = new Array(7 * 3 + 4);
    }

    tick() {
        const osc = this.osc;

        this.masterVolume = (this.registers[0x18] & 0x0f) / 15;

        // range -1..1
        let mix = 0;
        const oscVol = [1, 1, 1].map(x => x * 1.0);
        for (let i = 0; i < this.osc.length; i++) {
            osc[i].tick();
            mix += osc[i].output * oscVol[i];
        }
        mix = (mix / this.osc.length);
        mix = mix * this.masterVolume;
        this.output = mix;
    }

    setRegisters(regs) {
        if (regs.length !== 29) {
            throw new Error('sid only controls 29 registers');
        }
        this.registers = regs;
        this.osc[0].setRegisters(regs.slice(0, 7));
        this.osc[1].setRegisters(regs.slice(7, 14));
        this.osc[2].setRegisters(regs.slice(14, 21));
    }
}