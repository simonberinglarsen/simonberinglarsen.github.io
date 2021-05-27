class Account {
    constructor(balance) {
        this.history = [];
        this.log(0, 'created', '', 0, 0, balance, 0);
        this.positions = [];
    }

    get accountBalance() {
        return this.history[this.history.length - 1].accountBalance;
    }

    get invested() {
        return this.history[this.history.length - 1].invested;
    }

    openPosition(stock, time, count) {
        const cost = stock.priceAt(time) * count;
        let pos = this.positions.find(p => p.stock === stock);
        if (!pos) {
            pos = new Position(stock, count, cost);
            this.positions.push(pos);
        }
        else {
            pos.count += count;
            pos.cost += cost;
        }
        this.log(time, 'buy', stock.name, count, 0, this.accountBalance - pos.cost, this.invested + pos.cost);

    }

    closePosition(pos, time) {
        var pos = this.positions.find(p => p === pos);
        if (!pos) {
            throw new Error('position was not found');
        }
        const income = pos.stock.priceAt(time) * pos.count;
        this.log(time, 'sell', pos.stock.name, pos.count, income - pos.cost, this.accountBalance + income, this.invested - pos.cost);
        this.positions = this.positions.filter(p => p !== pos);
    }

    log(time, action, stock, count, earnings, accountBalance, invested) {
        this.history.push(
            {
                time,
                action,
                stock,
                count,
                earnings,
                accountBalance,
                invested,
                total: accountBalance + invested
            }
        );
    }


}

class Position {
    constructor(stock, count, cost) {
        this.stock = stock;
        this.count = count;
        this.cost = cost;
    }
}

class AccountBuilder {
    constructor(stocks) {
        this.stocks = stocks;
        this.marketLength = stocks[0].curve.data.length;
    }

    rollDice() {
        return Math.floor(Math.random() * 6 + 1);
    }

    build() {
        const acc = new Account(1000000);
        for (let i = 0; i < this.marketLength; i++) {
            const buyNewStock = this.rollDice() + this.rollDice() >= 12;
            if (buyNewStock) {
                const money = Math.min(acc.accountBalance, (Math.random() * 9 + 1) * 100000);
                const stock = this.stocks[Math.floor(Math.random() * this.stocks.length)];
                const price = stock.priceAt(i);
                const count = Math.floor(money / price);
                if (count === 0) {
                    continue;
                }
                acc.openPosition(stock, i, count);

                continue;
            }
            const sellStock = this.rollDice() + this.rollDice() >= 12;
            if (sellStock) {
                const posToSell = acc.positions[Math.floor(Math.random() * acc.positions.length)];
                if (!posToSell) {
                    continue;
                }
                acc.closePosition(posToSell, i);
                continue;
            }
        }
        acc.positions.forEach(p => acc.closePosition(p, this.marketLength - 1));
        return acc;
    }
}

export { AccountBuilder }