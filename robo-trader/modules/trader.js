import { avatars, traderNames } from './constants.js';
import { AccountBuilder } from './account.js';

class Trader {
    constructor(name, avatar, account, growth) {
        this.name = name;
        this.avatar = avatar;
        this.account = account;
        this.growth = growth;
    }
}

class TradersBuilder {
    constructor(count, stocks) {
        this.count;
        this.traders = new Array(count).fill(0).map(x => {
            const name = traderNames[Math.floor(Math.random() * traderNames.length)];
            const avatar = avatars[Math.floor(Math.random() * avatars.length)];
            const account = new AccountBuilder(stocks).build();
            const growth = Math.round((account.history[account.history.length - 1].total - 1000000) / 1000) / 10;
            return new Trader(name, avatar, account, growth);
        });
    }

    build() {
        return this.traders;
    }

}

export { TradersBuilder }