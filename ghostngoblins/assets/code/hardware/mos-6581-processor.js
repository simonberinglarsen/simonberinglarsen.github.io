/* global sampleRate:readonly */
import { SidChip } from './sid-chip.js';

class MOS6581Processor extends AudioWorkletProcessor {
    sid = null;
    sidRegs = new Array(29).fill(0);
    mute = false;

    constructor(...args) {
        super(...args);
        this.sid = new SidChip(sampleRate);
        this.port.onmessage = (msg) => {
            this.sidRegs = msg.data.regs;
            this.mute = msg.data.mute;
        }
    }

    tick() {
        this.sid.setRegisters(this.sidRegs);
        this.sid.tick();
    }

    getNextSample() {
        this.tick();
        return this.sid.output;
    }

    process(inputs, outputs) {
        const output = outputs[0]
        output.forEach(channel => {
            for (let i = 0; i < channel.length; i++) {
                channel[i] = this.getNextSample() * (this.mute ? 0 : 1);
            }
        })
        return true;
    }
}

registerProcessor('mos-6581-processor', MOS6581Processor)
