import { cards } from './cards.mjs';

const fruits = ["🍕", "🍔", "🍟", "🌭", "🍩", "🍪", "🍫", "🍺", "🍷", "🍹"];

export class App {
    constructor() {
        this.fruitIndex = 0;
    }
    runRandom() {
        $('#training').empty();
        const index = Math.floor(Math.random() * cards.length);
        const c = cards[index];
        const fruit = fruits[this.fruitIndex];
        this.fruitIndex = (this.fruitIndex + 1) % fruits.length;

        $('#training').append(`
    <div class="card">
      <div class="card-header">
        <h3><span class="fruit">${fruit}</span> ${c.title}</h3>
      </div>
      <p>${c.description}</p>
      <div class="card-footer">${index + 1}/${cards.length}</div>
    </div>
  `);
    }

    runDefault() {
        $('#training').empty();
        $('#training').append(`
      <div class="card">
        <div class="card-header">
          <h3><span class="dice">🎲</span> Velkommen!</h3>
          
        </div>
        <p>Klik på terningen i hjørnet for at få en tilfældig træningsøvelse.</p>
      </div>
    `);
    }
}

const app = new App();
app.runDefault();

$('#dice-btn').on('click', () => app.runRandom());
