export class App {
    constructor() {

    }

    run() {
        $('input').keyup(() => {
            const h1 = $('h1');
            const input = $('input'); 
            h1.empty();
            let text = input.val();
            let newlink = $(`<a href="${text}" target="_blank">${text}</a>`);
            h1.append(newlink);
        });
    }
}
