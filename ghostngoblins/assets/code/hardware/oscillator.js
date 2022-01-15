export class Oscillator {
    static WAVEFORM_NONE = 'none';
    static WAVEFORM_NOISE = 'noise';
    static WAVEFORM_TRIANGLE = 'triangle';
    static WAVEFORM_PULSE = 'pulse';
    static WAVEFORM_SAW = 'saw';
    static ENV_STATE_ATTACK = 'attack';
    static ENV_STATE_DECAY = 'decay';
    static ENV_STATE_SUSTAIN = 'sustain';
    static ENV_STATE_RELEASE = 'release';

    constructor(sampleRate) {
        this.sampleRate = sampleRate;
        this.waveform = Oscillator.WAVEFORM_TRIANGLE;
        this.phase = 0;
        this.phaseDelta = 0;
        this.phasePrev = 0;
        this.noiseValue = 0;
        this.phaseLength = 0x10000;
        this.phaseMiddle = this.phaseLength / 2;
        this.envelope = {
            a: 0,
            d: 0,
            s: 0,
            r: 0,
            state: Oscillator.ENV_STATE_ATTACK,
            out: 0,
            gate: false,
            gatePrev: false,
        };
        this.output = 0;

        this.registers = new Array(7).fill(0);
    }

    setRegisters(regs) {
        if (regs.length !== 7) {
            throw new Error('Need 7 regs for each voice!');
        }
        this.registers = regs;
    }

    processOscillator() {
        let out = 0;

        switch (this.waveform) {
            case Oscillator.WAVEFORM_TRIANGLE: {
                if (this.phase < this.phaseMiddle) {
                    const a = 2 / this.phaseMiddle;
                    const b = -1;
                    out = a * (this.phase) + b;
                }
                else {
                    const a = -2 / this.phaseMiddle;
                    const b = 3;
                    out = a * (this.phase) + b;
                }
                break;
            }
            case Oscillator.WAVEFORM_SAW: {
                const a = 2 / this.phaseLength;
                const b = -1;
                out = a * (this.phase) + b;
                break;
            }
            case Oscillator.WAVEFORM_PULSE: {
                const pwn = (this.registers[0x03] & 0x0f) * 0x100 + this.registers[0x02];
                const pwout = (pwn / 40.95) / 100;
                const pw = this.phaseLength * pwout;
                out = (this.phase < pw) ? 1 : -1;
                break;
            }
            case Oscillator.WAVEFORM_NOISE: {
                if (this.isPhaseReset()) {
                    this.updateNoiseSample();
                }
                out = this.noiseValue;
                break;
            }
            default: {
                out = 0;
                break;
            }
        }
        return out;
    }

    processEnvelope() {
        const config = {
            a: [.002, .008, .016, .024, .038, .056, .068, .08, .1, .25, .5, .8, 1, 3, 5, 8],
            d: [.006, .024, .048, .072, .114, .168, .204, .24, .3, .75, 1.5, 2.4, 3, 9, 15, 24],
            s: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(x => x / 15),
            r: [.006, .024, .048, .072, .114, .168, .204, .24, .3, .75, 1.5, 2.4, 3, 9, 15, 24],
        };
        const gateChanged = this.envelope.gatePrev !== this.envelope.gate;
        if (gateChanged) {
            let attackTime = config.a[(this.registers[0x05] >> 4)];
            let decayTime = config.d[(this.registers[0x05] & 0x0f)];
            let sustainLevel = config.s[(this.registers[0x06] >> 4)];
            let releaseTime = config.r[(this.registers[0x06] & 0x0f)];
            this.envelope.a = 1 / (this.sampleRate * attackTime);
            this.envelope.d = (1 - sustainLevel) / (this.sampleRate * decayTime);
            this.envelope.s = sustainLevel;
            this.envelope.r = 1 / (this.sampleRate * releaseTime);
            if (this.envelope.gate) {
                this.envelope.state = Oscillator.ENV_STATE_ATTACK;
            }
            else {
                this.envelope.state = Oscillator.ENV_STATE_RELEASE;
            }
        }
        switch (this.envelope.state) {
            case Oscillator.ENV_STATE_ATTACK:
                this.envelope.out += this.envelope.a;
                if (this.envelope.out >= 1) {
                    this.envelope.out = 1;
                    this.envelope.state = Oscillator.ENV_STATE_DECAY;
                }
                break;
            case Oscillator.ENV_STATE_DECAY:
                this.envelope.out -= this.envelope.d;
                if (this.envelope.out <= this.envelope.s) {
                    this.envelope.out = this.envelope.s;
                    this.envelope.state = Oscillator.ENV_STATE_SUSTAIN;
                }
                break;
            case Oscillator.ENV_STATE_SUSTAIN:
                this.envelope.out = this.envelope.s;
                break;
            case Oscillator.ENV_STATE_RELEASE:
                this.envelope.out -= this.envelope.r;
                if (this.envelope.out <= 0) {
                    this.envelope.out = 0;
                }
                break;
            case Oscillator.WAVEFORM_NONE:
                this.envelope.out = 0;
                break;
        }

        return this.envelope.out;
    }

    toWord(low, hi) {
        return low + 0x100 * hi;
    }

    tick() {
        if (this.waveform === Oscillator.WAVEFORM_NOISE) {
            let n = this.toWord(this.registers[0x00], this.registers[0x01]);
            this.phaseDelta = (this.phaseLength / this.sampleRate) * n;
        }
        else {
            const hz = this.toWord(this.registers[0x00], this.registers[0x01]) / 17.02954545454545;
            this.phaseDelta = (this.phaseLength / this.sampleRate) * hz;
        }

        this.phasePrev = this.phase;
        this.phase = (this.phase + this.phaseDelta) % (this.phaseLength);
        this.envelope.gatePrev = this.envelope.gate;
        this.envelope.gate = !!(this.registers[0x04] & 0x01);
        this.waveform =
            (this.registers[0x04] & 0x80) !== 0 ? Oscillator.WAVEFORM_NOISE :
                (this.registers[0x04] & 0x40) !== 0 ? Oscillator.WAVEFORM_PULSE :
                    (this.registers[0x04] & 0x20) !== 0 ? Oscillator.WAVEFORM_SAW :
                        (this.registers[0x04] & 0x10) !== 0 ? Oscillator.WAVEFORM_TRIANGLE :
                            Oscillator.WAVEFORM_NONE;
        let oscOut = this.processOscillator();
        let envOut = this.processEnvelope();

        // range -1..1
        this.output = oscOut * envOut;
    }

    isPhaseReset() {
        return this.phase < this.phasePrev || this.phaseDelta > this.phaseLength;
    }

    updateNoiseSample() {
        this.noiseValue = (Math.random() * 2 - 1);
    }
}
