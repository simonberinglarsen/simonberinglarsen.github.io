

/*

An ice cream stand opens up at 11am on a sunny day.

How long will a customer who arrives around 6pm need to wait for the ice cream maker to begin making a cone for them?

It takes the ice cream maker on average seven minutes to make each cone, regardless of time of day.

You can assume that cone-making time is normally distributed, with a standard deviation of one minute,so a library call like https://docs.python.org/3/library/random.html#random.normalvariate should do the trick.

A new customer shows up on average every seven minutes, regardless of time of day. You can assumethat arrivals are exponentially distributed, so https://docs.python.org/3/library/random.html#random.expovariate would be a good way to simulatethe length of time between each arrival.

Please run your simulation 1,001 times.

To show us your answer, please build a web page where a user can adjust the default parametersspelled out abov
that the simulated time window is seven hours,
- that cone-making time is on average seven minutes with a standard deviation of one minute,
- that arrivals are spaced on average seven minutes apart, and
- that the simulation is repeated 1,001 times);
and can then see how many minutes the final-arriving customer needs to wait for the ice cream makerto begin making their cone.
Please use Python, JavaScript, or both, in whatever framework(s) you prefer.
Your UI can be as simple asyou’d like it to be.

*/

const EventConeStart = 'EventConeStart';
const EventConeEnd = 'EventConeEnd';
const EventCustomerEnterShop = 'EventCustomerEnterShop';
const EventCustomerExitShop = 'EventCustomerExitShop';
const EventLastCustomerAndCloseShop = 'EventLastCustomerAndCloseShop';
const EventShopOpen = 'EventShopOpen';

class Event {
    constructor(eventType, time) {
        this.eventType = eventType;
        this.time = time;
    }
}

class Simulation {
    constructor() {
        this.eventHandlers = {
            [EventConeStart]: () => { this.onEventConeStart(); },
            [EventConeEnd]: () => { this.onEventConeEnd(); },
            [EventCustomerEnterShop]: () => { this.onEventCustomerEnterShop() },
            [EventCustomerExitShop]: () => { this.onEventCustomerExitShop() },
            [EventLastCustomerAndCloseShop]: () => { this.onEventLastCustomerAndCloseShop() },
            [EventShopOpen]: () => { this.onEventShopOpen() },
        };
    }

    run(params) {
        let sum = 0;
        this.params = params;
        for (let i = 0; i < params.runs; i++) {
            this.singleRun();
            sum += this.state.result;
        }
        return sum/params.runs;
    }

    singleRun() {
        this.state = {
            customerCount: 0,
            coneCount: 0,
            shopClosed: false,
            processed: [],
            result: null
        };
        this.events = [];
        this.processed = [];

        const startTime = this.params.simulationStart;
        this.events.push(new Event(EventShopOpen, startTime));
        const endTime = this.params.simulationEnd;
        this.events.push(new Event(EventLastCustomerAndCloseShop, endTime));
        this.process();
    }

    randomCone() {
        let s = jStat.normal.sample( this.params.coneDuration, this.params.coneDeviation )
        return s;
    }

    randomCustomer() {
        let s = jStat.exponential.sample( 1/this.params.customerDuration );
        return s;
    }

    onCustomerEnter() {
        if (this.state.coneCount > 0) {
            this.state.coneCount--;
            this.events.push(new Event(EventCustomerExitShop, this.state.time));
        }
        else {
            this.state.customerCount++;
        }
    }

    onEventConeStart() {
        if (this.state.shopClosed && this.state.customerCount === 1) {
            const closeTime = this.processed.find(e => e.eventType === EventLastCustomerAndCloseShop).time;
            this.state.result = this.state.time - closeTime;
            this.events = [];
            return;
        }
        this.events.push(new Event(EventConeEnd, this.state.time + this.randomCone()));
    }

    onEventConeEnd() {
        if (this.state.customerCount > 0) {
            this.events.push(new Event(EventCustomerExitShop, this.state.time));
            this.state.customerCount--;
        }
        else {
            this.state.coneCount++;
        }
        this.events.push(new Event(EventConeStart, this.state.time));
    }

    onEventCustomerEnterShop() {
        this.onCustomerEnter();
        this.events.push(new Event(EventCustomerEnterShop, this.state.time + this.randomCustomer()));
    }

    onEventCustomerExitShop() {

    }

    onEventLastCustomerAndCloseShop() {
        this.events = this.events.filter(e => e.eventType !== EventCustomerEnterShop);
        this.onCustomerEnter();
        this.state.shopClosed = true;

        if (this.state.customerCount <= 1) {
            this.state.result = 0;
            this.events = [];
        }
    }

    onEventShopOpen() {
        this.events.push(new Event(EventCustomerEnterShop, this.state.time + this.randomCustomer()));
        this.events.push(new Event(EventConeStart, this.state.time));

    }

    process() {
        while (this.events.length > 0) {
            this.events.sort((a, b) => a.time - b.time);
            const currentEvent = this.events.shift();
            this.state.time = currentEvent.time;
            this.eventHandlers[currentEvent.eventType]();

            //console.log(`${currentEvent.time}: ${currentEvent.eventType}`);
            //console.log(`=> new state (${JSON.stringify({ ...this.state, processed: null })}`);
            this.processed.push(currentEvent);
        }
    }
}



export class App {
    constructor() {
        this.simulation = new Simulation();
    }

    run() {
        $('#btn-run').click(() => {
            const params = {
                runs: +$('#input-runs').val(),
                simulationStart: (+$('#input-simulationStart').val())*60,
                simulationEnd: (+$('#input-simulationEnd').val())*60,
                coneDuration: +$('#input-coneDuration').val(),
                coneDeviation: +$('#input-coneDeviation').val(),
                customerDuration: +$('#input-customerDuration').val()
            };
            const avgTime = this.simulation.run(params);
            $('#results').html(`avg wait time in minutes = ${avgTime}`);
        });
    }
}
