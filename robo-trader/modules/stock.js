import { businessIcons, companyNames } from './constants.js';
import { CurveBuilder } from './curve.js';

class StocksBuilder {
    constructor(days) {
        this.days = days;
    }

    build() {
        return companyNames.map(name => {
            const start = Math.floor(Math.random() * 800 + 10);
            const growth = Math.random() - 0.4;
            const end = start * (1 + growth);
            let curve = new CurveBuilder(this.days, start, end).withNoise(Math.random() * 0.5 + 0.5, -start / 100, start / 100).build();
            let icon = businessIcons[Math.floor(Math.random() * businessIcons.length)];
            let stock = new Stock(name, icon, curve);
            return stock;
        });
    }
}

class Stock {
    constructor(name, icon, curve) {
        this.name = name;
        this.curve = curve;
        this.icon = icon;
    }

    priceAt(i) {
        return this.curve.data[i];
    }
}

export { StocksBuilder, Stock }