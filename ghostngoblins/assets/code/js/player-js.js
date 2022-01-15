import { Cmd, songs } from './player-js-song-data.js'

class SidVoiceData {
    frequency = 0;
    pulsewidth = 0;
    waveform = 0;
    gate = 0;
    envelope = new Envelope();
    regs = new Array(7).fill(0);

    convertToRegisters() {
        this.regs[0] = this.frequency & 0xff;
        this.regs[1] = this.frequency >> 8;
        this.regs[2] = this.pulsewidth & 0xff;
        this.regs[3] = this.pulsewidth >> 8;
        this.regs[4] = this.waveform | this.gate;
        this.regs[5] = (this.envelope.attack << 4) | (this.envelope.decay);
        this.regs[6] = (this.envelope.sustain << 4) | (this.envelope.release);

        return [...this.regs];
    }
}

class SidData {
    voices = [new SidVoiceData(), new SidVoiceData(), new SidVoiceData()];
    regs = new Array(0x1d).fill(0);
    cutOffFreq = 0;
    volume = 0;
    filterMode = 0;
    convertToRegisters() {
        const voice0 = this.voices[0].convertToRegisters();
        const voice1 = this.voices[1].convertToRegisters();
        const voice2 = this.voices[2].convertToRegisters();
        const x = [...this.regs];
        x.splice(0, voice0.length, ...voice0);
        x.splice(7, voice0.length, ...voice1);
        x.splice(14, voice0.length, ...voice2);
        x[0x15] = 0xc8;
        x[0x16] = 0xa0;
        x[0x17] = 0x80;
        x[0x18] = this.filterMode << 4 | this.volume;
        return x;
    }
}

class Envelope {
    attack = 0;
    decay = 0;
    sustain = 0;
    release = 0;
    static createWithAdsr(attack, decay, sustain, release) {
        const env = new Envelope();
        env.attack = attack;
        env.decay = decay;
        env.sustain = sustain;
        env.release = release;
        return env;
    }
}

class ResettableNumber {
    value = 0;
    original = 0;

    constructor(v) {
        this.value = v;
        this.original = v;
    }

    reset() {
        this.value = this.original;
    }

    setResetPoint(resetPoint) {
        this.original = resetPoint;
    }
}

class EffectBase {
    enabled = false;
    delay = new ResettableNumber(0);
    timer = new ResettableNumber(0);
    readyForProcessing = false;

    updateTimers() {
        this.readyForProcessing = false;
        if (!this.enabled) {
            return;
        }
        if (this.delay.value !== 0) {
            this.delay.value--;
            return;
        }
        this.timer.value--;
        if (this.timer.value !== 0) {
            return;
        }
        this.timer.reset();
        this.readyForProcessing = true;
    }

    process(chn) {
        this.updateTimers();
        if (!this.readyForProcessing) {
            return;
        }
        this.code(chn);
    }

    code() {
        throw new Error("Method code must be implemented.");
    }

    newNote() {
        throw new Error("Method newNote must be implemented.");

    }
}

class SlideEffect extends EffectBase {
    targetFrequence = 0;
    frequencyDelta = 0;

    code(chn) {
        if (!chn.slideEffect.enabled) {
            return;
        }
        if ((chn.frequency >> 8) < (this.targetFrequence >> 8)) {
            const f = (chn.frequency + this.frequencyDelta);
            chn.frequency = f
            chn.frequencyUnchanged = f;
        }
        else if (Channel.snapToTargetFrequence) {
            chn.frequency = this.targetFrequence;
            Channel.snapToTargetFrequence = false;
            chn.slideEffect.enabled = false;
        }
    }

    loadCommandData(data, f) {
        this.enabled = true;
        this.delay.setResetPoint(data[0]);
        this.delay.value = data[0];
        this.targetFrequence = f;
    }
}

class PulseEffect extends EffectBase {
    pw = new ResettableNumber(0);
    pwLimit = 0;
    resetOnNewNote = false;
    pwDelta = 0;

    code() {
        this.pw.value += this.pwDelta;
        if (this.pw.value >= this.pwLimit) {
            this.pw.reset();
        }
    }

    newNote() {
        if (this.resetOnNewNote) {
            this.pw.reset();
        }
    }

    loadCommandData(data) {
        this.enabled = true;
        this.timer.setResetPoint(data[0]);
        this.delay.setResetPoint(data[1]);
        this.delay.value = data[1];
        this.pwDelta = data[2];
        this.resetOnNewNote = !!data[3];
    }
}

class VibratoEffect extends EffectBase {
    vibratoDelta = 0;
    index = 0;

    code(chn) {
        const deltas = [-this.vibratoDelta, 0, this.vibratoDelta, 0];
        chn.frequency = (chn.frequencyUnchanged + deltas[this.index]) & 0xffff;
        this.index = (this.index + 1) % deltas.length;
    }

    loadCommandData(data) {
        this.enabled = true;
        this.timer.setResetPoint(data[0]);
        this.delay.setResetPoint(data[1]);
        this.delay.value = data[1];
        this.vibratoDelta = data[2];
    }
}

class ArpeggioEffect extends EffectBase {
    up = true;

    code(chn) {
        if (this.up) {
            chn.frequency = Math.floor(chn.frequency * 2);
        }
        else {
            chn.frequency = Math.floor(chn.frequency / 2);
        }
        this.up = !this.up;
    }

    newNote() {
        this.up = true;
    }

    loadCommandData(data) {
        this.enabled = true;
        this.timer.setResetPoint(data[0]);
        this.delay.setResetPoint(data[1]);
        this.delay.value = data[1];
    }
}

class Channel {
    text = '';
    trk = 0;
    trkOffset = 0;
    pattern = 0;
    patterns = [];

    static snapToTargetFrequence = false;
    noteLength = 0;
    percussionIsSet = false;
    percussionHasEnded = true;
    percussionLength = 0;
    waveform = 0;
    frequency = 0;
    frequencyUnchanged = 0;
    envelope = new Envelope();
    percussionProgramCounter = 0;
    percussionProgram = [];
    pulseEffect = new PulseEffect();
    arpeggioEffect = new ArpeggioEffect();
    vibratoEffect = new VibratoEffect();
    slideEffect = new SlideEffect();

    effects() {
        if (this.percussionIsSet) {
            return;
        }
        this.pulseEffect.process(this);
        this.vibratoEffect.process(this);
        this.arpeggioEffect.process(this);
        this.slideEffect.process(this);
    }

    newNote(frequency) {
        this.frequency = frequency;
        this.frequencyUnchanged = frequency;
        this.arpeggioEffect.delay.reset();
        this.arpeggioEffect.newNote(this);
        this.pulseEffect.delay.reset();
        this.pulseEffect.newNote(this);
        this.vibratoEffect.delay.reset();
        this.slideEffect.delay.reset();
        Channel.snapToTargetFrequence = true;
    }

    setPattern(id) {
        this.pattern = this.patterns[id];
        this.patternId = id;
    }

    getEffectText() {
        const colors = {
            arp: this.arpeggioEffect.enabled ? 'inv-dark-purple' : 'dark-grey',
            pulse: this.pulseEffect.enabled ? 'inv-dark-green' : 'dark-grey',
            vibrato: this.vibratoEffect.enabled ? 'inv-orange' : 'dark-grey',
            slide: this.slideEffect.enabled ? 'inv-lavender' : 'dark-grey',
        };
        let txt = ` <span ${colors.arp}>   Arpeggio  </span>\n`;
        txt += ` <span ${colors.pulse}>  Pulse Mod. </span>\n`;
        txt += ` <span ${colors.vibrato}>   Vibrato   </span>\n`;
        txt += ` <span ${colors.slide}>    Slide    </span>\n`;
        return txt;
    }

    noteIndexToText(noteIndex) {
        const note = (noteIndex & 0x0f) - 1;
        const octave = (noteIndex >> 4) & 0x7;
        let noteText = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-', 'C-'][note];
        noteText = noteText + (octave + (note == 12 ? -1 : 0));
        return noteText;
    }

    setTextDrums(gate, d0, l) {
        const colors = ['white', 'blue', 'pink', 'red', 'brown'];
        const activeColor = gate ? 'yellow glowText' : 'red';
        this.text += `<span ${activeColor}>@#!</span> <span dark-grey>(${(d0).toString().padStart(3, '0')})</span> <span ${colors[l % colors.length]} glowText>${''.padStart(l, ' ')}*</span>\n\n`;
        this.text += `${this.getEffectText()}`;
    }

    setTextNote(gate, cmd, noteText) {
        const activeColor = gate ? 'yellow glowText' : 'red';
        this.text += `<span ${activeColor}>${noteText}</span> <span dark-grey>(${(cmd).toString().padStart(3, '0')})</span>\n\n`;
        this.text += `${this.getEffectText()}`;
    }

    updateText(gate) {
        this.text = `<span dark-grey>TRK#</span> ${(this.trkOffset-1).toString().padStart(2,'0')}\n`;
        this.text += `<span dark-grey>PAT#</span> ${this.patternId}\n\n`;
        if (this.percussionIsSet) {
            this.setTextDrums(gate, this.percussionLength + 1, this.percussionProgramId)
        }
        else if (this.noteIndex !== null) {
            this.setTextNote(gate, this.noteLength, this.noteIndexToText(this.noteIndex));
        }
        else {
            this.setTextNote(gate, this.noteLength, '===');
        }
        this.text = `<pre>${this.text}</pre>`;
    }
}

class PatternProcessor {
    constructor(currentVoice, chn, sidData, parsePatternTimer) {
        this.chn = chn;
        this.parsePatternTimer = parsePatternTimer;
        this.sidData = sidData;
        this.voice = this.sidData.voices[currentVoice];
    }

    setPercussion(number) {
        this.chn.percussionIsSet = true;
        this.chn.frequency = 0;
        this.chn.frequencyUnchanged = 0;
        this.chn.percussionHasEnded = false;
        const instr = songs.percussions[number];
        this.voice.envelope = { ...instr.header.envelope };
        this.voice.pulsewidth = instr.header.pulseWidth;
        this.voice.waveform = instr.header.waveform;
        this.voice.gate = 1;
        this.chn.percussionProgram = instr.program;
        this.chn.percussionProgramId = number;
        this.chn.percussionProgramCounter = 0;
    }

    readByte() {
        const byte = this.chn.pattern[this.chn.patternPos];
        this.chn.patternPos++;
        return byte;
    }

    readWord() {
        const hi = this.readByte();
        const lo = this.readByte();
        return (hi << 8) + lo;
    }

    parsePatternCommand(command) {
        let data;
        const readByte = () => (this.readByte());
        const readWord = () => (this.readWord());

        if (command === Cmd.setVolume) {
            data = [readByte()];
            this.sidData.volume = data[0];
        }
        else if (command === Cmd.patternPause) {
            data = [readByte()];
            this.parsePatternTimer.setResetPoint(data[0]);
        }
        else if (command === Cmd.envelopeAD) {
            data = [readByte()];
            this.chn.envelope.attack = data[0] >> 4;
            this.chn.envelope.decay = data[0] & 0x0f;
        }
        else if (command === Cmd.envelopeSR) {
            data = [readByte()];
            this.chn.envelope.sustain = data[0] >> 4;
            this.chn.envelope.release = data[0] & 0x0f;
        }
        else if (command === Cmd.setWaveform) {
            data = [readByte()];
            this.chn.waveform = data[0] & 0xfe;
        }
        else if (command === Cmd.pulseOn) {
            data = [readByte(), readByte(), readWord(), readByte()];
            this.chn.pulseEffect.loadCommandData(data);
        }
        else if (command === Cmd.arpOn) {
            data = [readByte(), readByte()];
            this.chn.arpeggioEffect.loadCommandData(data);
        }
        else if (command === Cmd.vibratoOn) {
            data = [readByte(), readByte(), readWord()];
            this.chn.vibratoEffect.loadCommandData(data);
        }
        else if (command === Cmd.slideOn) {
            data = [readByte(), readByte(), readByte()];
            this.chn.slideEffect.loadCommandData(data, this.unpackAsFrequency(data[2]));
        }
        else if (command === Cmd.pulseOff) {
            this.chn.pulseEffect.enabled = false;
            this.chn.pulseEffect.resetOnNewNote = false;
        }
        else if (command === Cmd.arpeggioOff) {
            this.chn.arpeggioEffect.enabled = false;
        }
        else if (command === Cmd.vibratoOff) {
            this.chn.vibratoEffect.enabled = false;
        }
        else if (command === Cmd.slideOnDirty) {
            data = [readByte(), readWord()];
            this.chn.slideEffect.timer.setResetPoint(data[0]);
            this.chn.slideEffect.frequencyDelta = data[1];
        }
        else if (command === Cmd.pulseOnDirty) {
            data = [readWord(), readWord()];
            this.chn.pulseEffect.pw.setResetPoint(data[0]);
            this.chn.pulseEffect.pwLimit = data[1];
        }
        else {
            throw Error('subroutine N/A !!');
        }
        this.chn.noteLength = 1;
    }

    nextPattern() {
        let patternLoaded = false;
        while (!patternLoaded) {
            let id = this.chn.trk[this.chn.trkOffset];
            this.chn.trkOffset += 1;
            if (id === 0) {
                this.chn.trkOffset = 0;
                continue;
            }
            this.chn.setPattern(id);
            this.chn.patternPos = 0;
            this.chn.noteLength = 1;
            patternLoaded = true;
        }
    }

    countdownPercussionLength() {
        this.chn.percussionLength--;
        if (this.chn.percussionLength === 0) {
            this.chn.percussionIsSet = false;
            this.chn.percussionHasEnded = true;
            this.chn.noteLength = 1;
        }
    }

    waitForCurrentNote() {
        if (this.chn.percussionIsSet) {
            this.countdownPercussionLength();
            return true;
        }
        this.chn.noteLength--;
        if (this.chn.noteLength <= 2) {
            this.voice.waveform = this.chn.waveform;
            this.voice.gate = false;
        }
        if (this.chn.noteLength !== 0) {
            return true;
        }
        return false;
    }

    unpackAsFrequency(noteIndex) {
        const note = (noteIndex & 0x0f) - 1;
        const octave = (noteIndex >> 4) & 0x7;
        if (note < 0 || note > 11) {
            //0: C, 1: C#, 2: D, 3: D#, 4: E, 5: F, 6: F#, 7: G, 8: G#, 9: A, 10: A#, 11: C
            throw Error('unsupported note please keep inside a single octave +1 note (0 <= noteIndex <= 11)');
        }
        const octave5frequencies = [
            0x2187, 0x2386, 0x25A2, 0x27DF, 0x2A3E, 0x2CC1, 0x2F6B,
            0x323C, 0x3539, 0x3863, 0x3BBE, 0x3F4B
        ];
        const scaleFrequencyToOctave = Math.pow(0.5, 5 - octave);
        return Math.floor(octave5frequencies[note] * scaleFrequencyToOctave);
    }

    process() {
        if (this.waitForCurrentNote()) {
            return;
        }

        const readByte = () => (this.readByte());
        let readNextLine = true;
        while (readNextLine) {
            let data;
            let cmd = readByte();
            if (cmd === 0) {
                this.nextPattern();
                continue;
            }
            else if (cmd >= Cmd.percussion0) {
                data = [readByte()];
                this.chn.percussionLength = data[0] - 1;
                const programId = cmd - Cmd.percussion0;
                this.setPercussion(programId);
                this.chn.noteIndex = null;
                return;
            }
            else if (cmd >= 200) {
                this.parsePatternCommand(cmd);
                continue;
            }
            data = [readByte()];
            this.chn.noteLength = cmd;
            if (data[0] !== 0) {
                this.voice.waveform = this.chn.waveform;
                this.voice.gate = 1;
                let frequency = this.unpackAsFrequency(data[0]);
                this.chn.newNote(frequency);
                this.chn.noteIndex = data[0];
            }
            else {
                this.voice.waveform = this.chn.waveform;
                this.voice.gate = 0;
                this.chn.noteIndex = null;
            }
            return;
        }
    }
}

export class PlayerJs {
    sidData = null;
    ch = null;
    parsePatternTimer = null;
    voice = null;
    frame = 0;

    constructor() {
    }

    init(songIndex) {
        this.frame = 0;
        this.sidData = new SidData();
        this.ch = [new Channel(), new Channel(), new Channel()];
        this.parsePatternTimer = new ResettableNumber(4);
        this.sidData.volume = 10;
        this.sidData.filterMode = 1;

        for (let i = 0; i < 3; i++) {
            this.ch[i].waveform = 0x10;
            this.ch[i].frequency = [0x4b44, 0x3539, 0x0b30][i];
            this.ch[i].frequencyUnchanged = [0x4b44, 0x3539, 0x0b30][i];
            this.ch[i].vibratoEffect.vibratoDelta = [100, 100, 356][i];
            this.ch[i].pulseEffect.pw.value = [1300, 1300, 1184][i];
            this.ch[i].pulseEffect.pwlimit = [0xe00, 0xe00, 0xc00][i];
            this.ch[i].envelope = [
                Envelope.createWithAdsr(4, 8, 12, 8),
                Envelope.createWithAdsr(4, 8, 8, 8),
                Envelope.createWithAdsr(4, 8, 2, 8),
            ][i];
            this.ch[i].pulseEffect.timer = new ResettableNumber(1);
            this.ch[i].arpeggioEffect.timer = new ResettableNumber(1);
            this.ch[i].vibratoEffect.timer = new ResettableNumber(1);
            this.ch[i].slideEffect.timer = new ResettableNumber(1);
            this.ch[i].noteLength = 2;
            this.ch[i].vibratoEffect.index = [0, 0, 0][i];
            this.ch[i].arpeggioEffect.delay.setResetPoint([1, 4, 4][i]);
            this.ch[i].pulseEffect.delay.setResetPoint([4, 4, 2][i]);
            this.ch[i].vibratoEffect.delay.setResetPoint([1, 1, 4][i]);
            this.ch[i].slideEffect.delay.setResetPoint([26, 8, 4][i]);
            this.ch[i].trk = songs[songIndex].tracks[i];
            this.ch[i].patterns = songs.patterns;
            this.ch[i].setPattern(this.ch[i].trk[0]);
            this.ch[i].patternPos = 0;
            this.ch[i].trkOffset = 1;
            this.ch[i].vibratoEffect.enabled = [true, true, false][i];
            this.ch[i].text = '';
        }
    }

    updateSidRegisters() {
        const setRegs = (voice) => {
            const v = this.sidData.voices[voice];
            v.frequency = this.ch[voice].frequency;
            v.pulsewidth = this.ch[voice].pulseEffect.pw.value;
            v.envelope = { ...this.ch[voice].envelope };
        };
        for (let i = 0; i < 3; i++) {
            if (!this.ch[i].percussionIsSet) {
                setRegs(i);
            }
        }
    }

    processPercussion() {
        if (this.chn.percussionHasEnded) {
            return;
        }
        let pc = this.chn.percussionProgramCounter;
        let program = this.chn.percussionProgram;
        if (pc >= program.length) {
            this.chn.percussionHasEnded = true;
            this.chn.percussionProgramCounter = 0;
        }
        else {
            this.voice.waveform = program[pc][0];
            this.voice.gate = program[pc][1];
            this.voice.frequency = program[pc][2];
            this.chn.percussionProgramCounter++;
        }
    }

    play() {
        this.frame++;
        let parsePattern = false;
        this.parsePatternTimer.value--;
        if (this.parsePatternTimer.value === 0) {
            this.parsePatternTimer.reset();
            parsePattern = true;
        }

        for (let i = 0; i < 3; i++) {
            let currentVoice = 2 - i;
            this.chn = this.ch[currentVoice];
            this.voice = this.sidData.voices[currentVoice];
            if (parsePattern) {
                new PatternProcessor(
                    currentVoice,
                    this.chn,
                    this.sidData,
                    this.parsePatternTimer).process();
                this.chn.updateText(this.voice.gate);
            }
            this.chn.effects();
            this.processPercussion();
        }

        this.updateSidRegisters();
    }

    getRegs() {
        return this.sidData.convertToRegisters();
    }
}
