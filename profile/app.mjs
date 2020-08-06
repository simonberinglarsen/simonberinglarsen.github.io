export class App {
    constructor() {

    }

    run() {
        let blocks = $('.block');
        let debug = $('.debug')[0];
        let observer = new IntersectionObserver(this.onIntersection, {
            rootMargin: '-40% 0px -40% 0px'
        });



        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            observer.observe(block);
        };





    }

    onIntersection(elements) {
        let output = '';
        elements.forEach(e => {
            output = output + `${e.target.className}.isVisible = ${e.isVisible}<br/>`;
            output = output + `${e.target.className}.isIntersecting = ${e.isIntersecting}<br/>`;
            let animIn = 'animate__fadeInLeft animate__fadeInRight animate__fadeInUp animate__fadeInDown animate__fadeInTopLeft animate__fadeInTopRight animate__fadeInBottomLeft animate__fadeInBottomRight'.split(' ');
            let animOut = 'animate__fadeOutLeft animate__fadeOutRight'.split(' ');
            let docImg = e.target.querySelector('*');
            if(!docImg) {
                return;
            }
            const rnd = (arr) => {
                return arr[Math.floor(Math.random()*arr.length)];
            };
            let img = $(docImg);
            img.removeClass(animIn.join(' '));
            img.removeClass(animOut.join(' '));
            if (e.isIntersecting) {
                img.addClass(rnd(animIn));
            }
            else {
                img.addClass(rnd(animOut));
            }
        });
    }
}