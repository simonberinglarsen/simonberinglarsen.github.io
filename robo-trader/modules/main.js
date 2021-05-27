import { StocksBuilder, Stock } from './stock.js';
import { IndexCurveBuilder } from './curve.js';
import { TradersBuilder } from './trader.js';

class App {
    constructor() {
        this.stocks = new StocksBuilder(300).build();
        this.indexCurve = new IndexCurveBuilder(this.stocks).build();
        this.traders = new TradersBuilder(1000, this.stocks).build();
        this.marketLength = this.indexCurve.data.length;
    }

    run() {
        this.bindHeader();
        this.showIndexCurve();
    }

    bindHeader() {
        const clearLeft = () => {
            $('.menu-item').removeClass('selected');
            $('.traders').empty();
            $('.stocks').empty();
            $('#trader-actions').empty();
            $(`#chart`).show();
            $(`#search`).hide();
            $(`#intro`).hide();
        };
        clearLeft();
        $('#menu-item-index').click(() => {
            clearLeft();
            $('#menu-item-index').addClass('selected');
            this.showIndexCurve();
        });
        $('#menu-item-top-traders').click(() => {
            clearLeft();
            $('#menu-item-top-traders').addClass('selected');
            this.bindTraders(this.traders.sort((a,b) => b.growth - a.growth).slice(0, 8));
        });
        $('#menu-item-failing-traders').click(() => {
            clearLeft();
            $('#menu-item-failing-traders').addClass('selected');
            this.bindTraders(this.traders.sort((a,b) => a.growth - b.growth).slice(0, 8));
        });
        $('#menu-item-top-stocks').click(() => {
            clearLeft();
            $('#menu-item-top-stocks').addClass('selected');
            this.bindStocks(this.stocks.sort((a,b) => b.curve.growth - a.curve.growth).slice(0, 8));
        });
        $('#menu-item-bottom-stocks').click(() => {
            clearLeft();
            $('#menu-item-bottom-stocks').addClass('selected');
            this.bindStocks(this.stocks.sort((a,b) => a.curve.growth - b.curve.growth).slice(0, 8));
        });
        $('#menu-item-search').click(() => {
            clearLeft();
            $(`#search`).show();
            $(`#chart`).hide();
            if(this.myChart) {
                this.myChart.destroy();
            }   
        });
        $(`#search`).keyup(() => {
            let str = $(`#search-input`).val();
            let resultsRaw = this.traders
                .filter(t => !!JSON.stringify({a:t.name, b:t.growth}).match(new RegExp(str, 'i')));
            let results = resultsRaw.slice(0,6);

            $(`#search-results`).empty();
            $(`#search-results`).append(`<div>.....${resultsRaw.length} hits</div>`)
            
            results.forEach(r => {
                const searchResult = $(`<div class="box px-2 py-1 m-1">${r.name} ${r.growth}%</div>`);
                $(`#search-results`).append(searchResult);
                searchResult.click(() => {
                    clearLeft();
                    this.bindTraders([r]);
                    this.showTrader(r);
                });
            });

            
        });
    }

    showIndexCurve() {
        this.bindStocks([new Stock('S&P 500', '📈', this.indexCurve)]);
        this.showStock('S&P 500', this.indexCurve);
        $(`#intro`).show();
    }

    bindStocks(stocks) {
        stocks.forEach((c,i) => {
            let rank;
            if (c.curve.growth > 0.25)
                rank = 2;
            else if (c.curve.growth > 0.1)
                rank = 1;
            else if (c.curve.growth > 0.0)
                rank = 3;
            else if (c.curve.growth > -0.1)
                rank = 4;
            else
                rank = 5;
            const id = `stock-box-${i}`;
            let isUp = c.curve.growth >= 0;
            let box = $(`<div id="${id}" class="box shadow bg-${rank} m-1 stock-box">
            <div class="d-flex row">
                <div class="f-2x border-right shadow px-1 py-1">${c.icon}</div>
                <div>
                    <div class="bold px-2 py-1">${c.name}</div>
                    <div class="px-2 pb-1">${isUp ? '🡅' : '🡇'} ${c.curve.growth}% ${isUp ? 'up' : 'down'}</div>
                </div>
            </div>`);
            box.click(() => {
                $(`.stock-box`).removeClass('selected');
                $(`#${id}`).addClass('selected');
                this.showStock(c.name, c.curve);
            });
            $('.stocks').append(box);
        });
    }

    bindTraders(traders) {
        traders.forEach((t,i) => {
            const arrow = t.growth >= 0 ?  '🡅' : '🡇';
            const updown = t.growth >= 0 ? 'fg-green' : 'fg-red';
            const updowntxt = t.growth >= 0 ? 'up' : 'down';
            const medal = i < 4 ? t.growth >= 0 ? '🥇' : '💩' : '';
            const id = `stock-box-${i}`;
            let box = $(`<div id="${id}" class="box shadow bg-3 m-1 trader-box">
            <div class="d-flex row">
                <div class="f-2x shadow border-right px-1 py-1">${t.avatar}</div>
                <div>
                    <div class="bold px-2 py-1">${medal} ${t.name}</div>
                    <div class="px-2 pb-1 "><span class="${updown}">${arrow}</span> ${Math.abs(t.growth)}% ${updowntxt}</div>
                </div>
            </div>`);
            box.click(() => {
                $(`.trader-box`).removeClass('selected');
                $(`#${id}`).addClass('selected');
                $('#trader-actions').empty();
                this.showTrader(t);
            });
            $('.traders').append(box);
        });
    }

    showTrader(trader) {
        let i = 0;
        const hist = trader.account.history;
        let data = new Array(this.marketLength).fill(hist[hist.length-1].total);
        for (let j = 0; j < hist.length; j++) {
            const lastElement = j === hist.length - 1;
            const time = hist[j].time;
            if(!lastElement && hist[j+1].time == time) {
                continue;
            }
            const totalEarnings = hist[j].total - 1000000;
            while (i <= time)
            {
                data[i] = totalEarnings;
                i++;
            }
        }

        this.showStock('Earnings', {data});
        let x = $(`
            <tr>
            <th>Time</th>
            <th>Action</th>
            <th>Stock</th>
            <th>Count</th>
            <th>Earnings</th>
            <th>Acc.Balance</th>
            <th>Invested</th>
            <th>Total</th>
            </tr>`);
        $('#trader-actions').append(x);
        trader.account.history.forEach((l, i) => {
            const profitable = l.action === 'sell' ? l.earnings > 0 ? 'fg-green bold' : 'fg-red bold' : '';
            const arrow = l.earnings > 0 ?  '🡅' : '🡇';
            const stockId = `history-stock-${i}`;
            let x = $(`
            <tr>
            <td class="align-right">${l.time}</td>
            <td class="${profitable}">${l.action}</td>
            <td id="${stockId}" class="clickable">📈 ${l.stock}</td>
            <td class="align-right">${l.count}</td>
            <td class="align-right ${profitable}">${l.action == 'sell' ? '$ ' + Math.abs(l.earnings).toFixed(2) + arrow + ' ' : ''}</td>
            <td class="align-right">$ ${l.accountBalance.toFixed(2)}</td>
            <td class="align-right">$ ${l.invested.toFixed(2)}</td>
            <td class="align-right ${l.total > 1000000 ? 'fg-green bold' : l.total < 1000000 ? 'fg-red bold' : ''}">$ ${l.total.toFixed(2)}</td>
            </tr>`);
            $('#trader-actions').append(x);
            $(`#${stockId}`).click(() => {
                const stock = this.stocks.find(s => s.name === l.stock);
                this.showStock(stock.name, stock.curve);
                
            });
        });

    }

    showStock(name, curve) {
        const values = curve.data;
        var ctx = document.getElementById('myChart').getContext('2d');
        const labels = new Array(curve.data.length).fill(0).map((v, i) => i)
        const data = {
            labels: labels,
            datasets: [{
                label: name,
                data: values,
                fill: false,
                borderColor: 'rgb(60, 60, 60)',
                tension: 0.1
            }]
        };
        const config = {
            type: 'line',
            data: data,
        };
        if(this.myChart) {
            this.myChart.destroy();
        }
        this.myChart = new Chart(ctx, config);
    }

}

export { App }