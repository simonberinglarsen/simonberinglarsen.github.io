export class Speech {


    async downloadByGid(url) {
        const downloader = new PGNDownloader(url);
        const pgn = await downloader.downloadPGN();
        return this.download(pgn);
    }

    async download(pgn) {
        const response = await fetch('speech_dk2.mp3');
        const data = await response.arrayBuffer();
        return new Promise((resolve, reject) => {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const offlineContext = new OfflineAudioContext(1, 44100 * 60, 44100); // 60 seconds of audio buffer

            const pgnSlices = this.parsePgn(pgn);
            offlineContext.oncomplete = async (event) => {
                try {
                    const mp3Data = [];
                    const audioBuffer = event.renderedBuffer;

                    // render slices
                    pgnSlices.forEach(x => this.renderSlice(mp3Data, audioBuffer, x));

                    // download file
                    const audioBlob = new Blob([new Uint8Array(mp3Data)], { type: 'audio/mpeg' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = audioUrl;
                    downloadLink.download = 'chessgame.mp3'; // Specify the file name
                    downloadLink.click();
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            };

            offlineContext.decodeAudioData(data).then((audioBuffer) => {
                const source = offlineContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(offlineContext.destination);
                source.start(0);
                offlineContext.startRendering();
            });

        });
    };

    parsePgn(pgn) {
        // https://ttsmp3.com/
        /*
a. b. c. d. e. f. g. h.
1. 2. 3. 4. 5. 6. 7. 8.
check. checkmate. takes. promotes to. castle. long. short.
pawn. rook. knight. bishop. queen. king.
white to move. white wins. black wins. the game begins.
game ends in a draw.


a. b. c. d. e. f. g. h.
et. to. tre. fire. fem. seks. syv. otte.
skak. skakmat. tager. forfremmes til. rokerer. langt. kort.
bonde. tårn. springer. løber. dronning. konge.
hvid trækker. hvid har vundet. sort har vundet. spillet starter.
spillet ender remis.
        */

        let removeNestedBraces = (inputStr) => {
            return inputStr.replace(/\{[^{}]*\}/g, '');
        }

        let removeNestedParentheses = (inputStr) => {
            return inputStr.replace(/\([^()]*\)/g, '');
        }

        let removeHeadersFromPGN = (pgnText) => {
            const cleanedPGN = pgnText.replace(/\[\s*[^]+?\s*".*?"\s*\]\s*/g, '');
            return cleanedPGN;
        }

        let removeExclamationAndQuestionMarks = (inputStr) => {
            return inputStr.replace(/[!?]/g, '');
        }


        let isDigit = (char) => {
            return !Number.isNaN(Number(char));
        }

        pgn = pgn.replace(/\d+\.{3}/g, '');
        pgn = pgn.replace(/\./g, '. ');
        pgn = removeHeadersFromPGN(pgn);
        pgn = removeNestedBraces(pgn);
        pgn = removeNestedParentheses(pgn);
        pgn = removeExclamationAndQuestionMarks(pgn);
        pgn = pgn.split(/\r|\n/).map(x => x.trim()).join(' ').trim();
        pgn = pgn.replace(/\s+/g, ' ');
        let raw = pgn.split(" ");
        raw = raw.map(x => {
            if (x == "O-O") return ["castle", "short"];
            if (x == "O-O-O") return ["castle", "long"];
            if (x == "1-0") return ["white-wins"];
            if (x == "0-1") return ["black-wins"];
            if (x == "1/2-1/2") return ["draw"];
            if (isDigit(x[0])) {
                if (x.trim() == "1.") return ["game-begins"];
                return ["delay3"]

            };
            let moveChars = x.split('').map(ch => ch
                .replace('R', 'rook')
                .replace('N', 'knight')
                .replace('B', 'bishop')
                .replace('Q', 'queen')
                .replace('K', 'king')
                .replace('x', 'takes')
                .replace('=', 'promotes-to')
                .replace('x', 'takes')
                .replace('#', 'checkmate')
                .replace('+', 'check')
            );
            return moveChars;
        }).map(x => [...x, "delay1"]);
        let slices = raw.filter(x => x.length > 0).flat();
        return slices
    }

    renderSilence(mp3Data, audioBuffer, duration) {
        const sampleRate = audioBuffer.sampleRate;
        const samples = duration * sampleRate;
        // Convert the sliced buffer to 16-bit PCM
        const pcmData = new Int16Array(samples);
        const sampleBlockSize = 1152; // This is the standard sample block size for MP3 encoding
        const mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
        for (let i = 0; i < pcmData.length; i += sampleBlockSize) {
            const sampleChunk = pcmData.subarray(i, i + sampleBlockSize);
            const mp3Chunk = mp3encoder.encodeBuffer(sampleChunk);
            mp3Data.push(...mp3Chunk);
        }

        const finalMp3Chunk = mp3encoder.flush();
        if (finalMp3Chunk.length > 0) {
            mp3Data.push(...finalMp3Chunk);
        }
    }

    renderSlice(mp3Data, audioBuffer, sliceName) {
        const sliceMapEN = {
            "a": [0, .58],
            "b": [0.75, .58],
            "c": [1.48, 0.66],
            "d": [2.3, 0.63],
            "e": [3.07, .58],
            "f": [3.78, 0.56],
            "g": [4.48, 0.66],
            "h": [5.28, 0.70],
            "1": [6.1, 0.71],
            "2": [7.09, 0.47],
            "3": [7.8, 0.7],
            "4": [8.86, 0.68],
            "5": [9.84, 0.76],
            "6": [10.91, 0.66],
            "7": [11.87, 0.75],
            "8": [12.91, 0.51],
            "check": [13.78, 0.48],
            "checkmate": [14.53, 0.733],
            "takes": [15.51, 0.597],
            "promotes-to": [16.45, 0.938],
            "castle": [17.63, 0.71],
            "long": [18.62, 0.495],
            "short": [19.45, 0.597],
            "pawn": [20.397, 0.546],
            "rook": [21.28, 0.375],
            "knight": [21.98, 0.512],
            "bishop": [22.9, 0.46],
            "queen": [23.67, 0.631],
            "king": [24.57, 0.529],
            "white-to-move": [25.47, 0.78],
        }

        const sliceMapDK = {
            "a": [0, .499],
            "b": [0.729, .486],
            "c": [1.571, 0.655],
            "d": [2.6, 0.348],
            "e": [3.3, 0.363],
            "f": [4.078, 0.456],
            "g": [4.936, .461],
            "h": [5.818, .428],
            "1": [6.641, 0.400],
            "2": [7.45, 0.32],
            "3": [8.189, 0.395],
            "4": [8.994, 0.51],
            "5": [9.914, 0.365],
            "6": [10.702, 0.573],
            "7": [11.681, 0.482],
            "8": [12.581, 0.479],
            "check": [13.446, 0.54],
            "checkmate": [14.394, 0.947],
            "takes": [15.752, 0.435],
            "promotes-to": [16.578, 1.071],
            "castle": [18.052, 0.807],
            "long": [19.254, 0.556],
            "short": [20.221, 0.456],
            "pawn": [21.088, 0.327],
            "rook": [21.806, 0.468],
            "knight": [22.656, 0.652],
            "bishop": [23.705, 0.624],
            "queen": [24.727, 0.545],
            "king": [25.68, 0.454],
            "white-to-move": [26.537, 0.996],
            "white-wins": [27.935, 1.021],
            "black-wins": [29.348, 1.077],
            "game-begins": [30.797, 1.16],
            "draw": [32.338, 1.438]
        }

        const sliceMap = sliceMapDK;

        if (sliceName == "delay1") {
            return this.renderSilence(mp3Data, audioBuffer, 1);
        } else if (sliceName == "delay2") {
            return this.renderSilence(mp3Data, audioBuffer, 2);
        } else if (sliceName == "delay3") {
            return this.renderSilence(mp3Data, audioBuffer, 3);
        }

        if (!sliceMap[sliceName]) {
            throw new Error('unknown slice: ' + sliceName);
        }
        const [startOffset, duration] = sliceMap[sliceName];
        // Create a slice of the audio data
        const sampleRate = audioBuffer.sampleRate;
        const startSample = Math.floor(startOffset * sampleRate);
        const endSample = Math.min(Math.floor((startOffset + duration) * sampleRate), audioBuffer.length);
        const sourceData = audioBuffer.getChannelData(0).subarray(startSample, endSample);

        const slicedBuffer = this.audioContext.createBuffer(1, endSample - startSample, sampleRate);
        slicedBuffer.copyToChannel(sourceData, 0);

        // Convert the sliced buffer to 16-bit PCM
        const pcmData = new Int16Array(slicedBuffer.getChannelData(0).map(x => x * 0x7fff));
        //const sampleBlockSize = 1152; // This is the standard sample block size for MP3 encoding
        const sampleBlockSize = pcmData.length; // This is the standard sample block size for MP3 encoding
        const mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
        for (let i = 0; i < pcmData.length; i += sampleBlockSize) {
            const sampleChunk = pcmData.subarray(i, i + sampleBlockSize);
            const mp3Chunk = mp3encoder.encodeBuffer(sampleChunk);
            mp3Data.push(...mp3Chunk);
        }

        const finalMp3Chunk = mp3encoder.flush();
        if (finalMp3Chunk.length > 0) {
            mp3Data.push(...finalMp3Chunk);
        }
    }
}

class PGNDownloader {
    constructor(url) {
        this.url = url;
    }

    async downloadPGN() {
        const response = await fetch(this.url);
        if (!response.ok) {
            throw new Error(`Unable to download pgn. ${response.status}`);
        }
        const data = await response.text();
        return data;
    }
}