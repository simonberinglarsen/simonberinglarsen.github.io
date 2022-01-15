import { SampleProvider } from './assets/code/hardware/sample-provider.js';
import { PlayerC64 } from './assets/code/c64/player-c64.js';
import { PlayerJs } from './assets/code/js/player-js.js';

export class App {
    sampleProvider = null;
    scriptNode = null;
    player = null;
    btnStart = null;
    btnPause = null;
    btnStop = null;
    btnFastForward = null;
    btnFastReverse = null;
    playerInfo = null;
    allButtons = [];
    progress = null;

    constructor() {
        this.playerInfo = document.getElementById('player-info');
        this.btnStart = document.getElementById('btn-start');
        this.btnPause = document.getElementById('btn-pause');
        this.btnStop = document.getElementById('btn-stop');
        this.btnFastForward = document.getElementById('btn-fast-forward');
        this.btnFastReverse = document.getElementById('btn-fast-reverse');
        this.uiProgress = {
            done: document.getElementById('progress-done'),
            todo: document.getElementById('progress-todo'),
            overflow: document.getElementById('progress-overflow'),
        };
        this.ch1 = document.getElementById('channel-1');
        this.ch2 = document.getElementById('channel-2');
        this.ch3 = document.getElementById('channel-3');
        this.buttonGroup = [this.btnStart, this.btnPause, this.btnStop];
        this.updateText();
    }

    run() {
        this.btnStart.onclick = () => {
            this.disableButton(this.btnStart);
            this.scriptNode.onaudioprocess = (event) => { this.handler(event) };
        };
        this.btnPause.onclick = () => {
            this.disableButton(this.btnPause);
            this.scriptNode.onaudioprocess = null;
            this.updateText();
        };
        const speed = 500;
        this.btnFastForward.onclick = () => {
            for (let i = 0; i < speed; i++) {
                this.player.play();
            }
            this.updateText();
        };
        this.btnFastReverse.onclick = () => {
            let restartAudio = this.scriptNode.onaudioprocess !== null; 
            this.scriptNode.onaudioprocess = null;
            const targetFrame = Math.max(0, Math.min(this.player.frame, this.player.frame - speed));
            this.player.init(1);
            for (let i = 0; i < targetFrame; i++) {
                this.player.play();
            }
            if(restartAudio) {
                this.scriptNode.onaudioprocess = (event) => { this.handler(event) };
            }
            this.updateText();
        };
        this.btnStop.onclick = () => {
            this.disableButton(this.btnStop);
            this.player.init(1);
            this.sampleProvider.reset();
            this.scriptNode.onaudioprocess = null;
            this.updateText();
        };
        this.disableButton(this.btnStop);

        this.startupTest();
        this.audioSetup();
    }

    disableButton(btn) {
        this.buttonGroup.forEach(b => b.disabled = b === btn);
    }

    startupTest() {
        let testResults = '';
        const logLine = (line) => {
            testResults += `${line}\n`;
        };
        for (let tune = 0; tune < 2; tune++) {
            logLine(`<span white>Song ${tune} test:</span>`);
            const playerSid = new PlayerC64();
            const playerJS = new PlayerJs();
            const frameSid = [];
            const frameJS = [];
            const forwardTo = 11800;
            const errors = {
            };
            playerSid.init(tune);
            for (let i = 0; i < forwardTo; i++) {
                playerSid.play();
                frameSid.push(playerSid.getRegs());
            }
            playerJS.init(tune);
            for (let i = 0; i < forwardTo; i++) {
                playerJS.play();
                frameJS.push(playerJS.getRegs());

                for (let j = 0; j < frameJS[i].length; j++) {
                    if (frameSid[i][j] !== frameJS[i][j]) {
                        errors[j] = errors[j] ? errors[j] + 1 : 1;
                    }
                }
            }

            let noErrors = errors
                && Object.keys(errors).length === 0
                && Object.getPrototypeOf(errors) === Object.prototype
            if (noErrors)
                logLine('  <span green>OK</span>');
            else {
                logLine('  <span red>FAILED</span>');
                logLine('  see console..');
                console.log(errors.toString());
            }
            logLine('');
        }
        logLine('<span yellow>Press play!</span>');
        this.ch1.innerHTML = testResults;
    }

    audioSetup() {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        if (context.createScriptProcessor) {
            this.scriptNode = context.createScriptProcessor(4096, 1, 1);
        } else {
            this.scriptNode = context.createJavaScriptNode(4096, 1, 1);
        }
        this.player = new PlayerJs();
        this.player.init(1);
        this.sampleProvider = new SampleProvider(context.sampleRate);
        this.sampleProvider.playRoutineHz = 50;
        this.sampleProvider.playRoutine = () => {
            this.player.play();
            return this.player.getRegs();
        };
        this.scriptNode.connect(context.destination);
    }

    updateText() {
        if (this.player) {
            this.ch1.innerHTML = this.player.ch[0].text;
            this.ch2.innerHTML = this.player.ch[1].text;
            this.ch3.innerHTML = this.player.ch[2].text;
            this.updateProgressText(this.player.frame);
        }
        else {
            this.ch1.innerHTML = 'Ready';
            this.ch2.innerHTML = 'Ready';
            this.ch3.innerHTML = 'Ready';
            this.updateProgressText(0);
        }
    }

    updateProgressText(playerFrame) {
        const maxFrames = 11500;
        let done = 100 * Math.min(1, (playerFrame) / maxFrames);
        let overflow = 0;
        if (playerFrame > maxFrames) {
            overflow = 5;
            done -= overflow;
        }
        this.uiProgress.done.style.width = `${done}%`;
        this.uiProgress.overflow.style.width = `${overflow}%`;
    }

    handler(event) {
        const output = event.outputBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) {
            output[i] = this.sampleProvider.getNextSample();
        }
        this.updateText();
    }
}
