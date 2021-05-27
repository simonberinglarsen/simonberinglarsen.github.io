class CurveBuilder {
    constructor(days, startValue, endValue) {
        this.days = days;
        this.startValue;
        this.endValue;
        this.slope = (endValue - startValue) / days;
        this.data = new Array(days)
            .fill(startValue)
            .map((v, i) => v + i * this.slope);
    }

    withNoise(speed, min, max) {
        let offset = 0;
        let delta = max - min;
        for (let i = 0; i < this.data.length; i++) {
            if (Math.random() < speed) {
                offset += Math.random() * delta + min;

            }
            let newValue = this.data[i] + offset;
            this.data[i] = Math.round(newValue * 10) / 10;
        }
        return this;
    }

    build() {
        return new Curve(this.data);
    }
}


class Curve {
    constructor(data) {
        this.data = data;
        const g = data[data.length - 1] / data[0] - 1;
        this.growth = Math.round(g * 1000) / 10;
    }
}


class IndexCurveBuilder {
    constructor(stocks) {
        this.stocks = stocks;
    }

    build() {
        let data = new Array(this.stocks[0].curve.data.length).fill(0);
        for (let i = 0; i < data.length; i++) {
            var sumOfDay = this.stocks.reduce((prev, cur) => prev + cur.curve.data[i], 0);
            data[i] = sumOfDay / this.stocks.length;
        }
        return new Curve(data);
    }
}

export { IndexCurveBuilder, CurveBuilder }