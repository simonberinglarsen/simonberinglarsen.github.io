$('.version').html('version: 2020-09-18.2');

/*
    CHANGE history:

    2020-09-18.2:
    * add webpage icon to projects
    * add background from solanabeach.io
    * give $> another color
    * bright hero image

    2020-09-18.1:
    * media links moved to project header
    * push media links right

    2020-09-17.2:
    * media links added

    2020-09-17.1:
    * media links mock up

    2020-09-16.1:
    * terminal colors updated
    * terminal writing flow a bit more human like.

    2020-09-14.6:
    * aos - appear when scroll

    2020-09-14.5:
    * project titles font/size change
    * updated terminal look
    * subtle tiled background
    * shadows adjusted 
    
    2020-09-14.4:
    * no console typing for title + slogan

    2020-09-14.3:
    * center header, main and footer content
    * adjust colors (green text, background color)
    * card layout -> console only in description
    * version number added in upper left corner
*/

AOS.init();
const projects = [
    {
        logo: 'blocknet1.png',
        title: 'BlockNet',
        slogan: 'Internet of Blockchains',
        description: 'Blocknet is a blockchain interoperability protocol that enables communication, interaction, and exchange between different public and private blockchains, as well as on-chain access to off-chain data, APIs, and services via oracles.',
        mediaLinks: [
            { name: 'Webpage', url: 'https://blocknet.co', icon:'<i class="fas fa-globe-americas"></i>' },
            { name: 'Telegram', url: 'https://t.me/Blocknet', icon:'<i class="fab fa-telegram"></i>' },
            { name: 'Discord', url: 'https://discord.gg/jydgk2', icon:'<i class="fab fa-discord"></i>' },
            { name: 'Twitter', url: 'https://twitter.com/The_Blocknet', icon:'<i class="fab fa-twitter"></i>' },
            { name: 'Stats', url: 'https://dropstab.com/blocknet', icon:'<i class="fas fa-chart-line"></i>' },
        ]
    },
    {
        logo: 'casperlabs3.png',
        title: 'Casperlabs',
        slogan: 'Blockchain for the builders',
        description: 'Build unstoppable businesses on the truly scalable, simple to use, and always secure blockchain and smart contracting platform.',
        mediaLinks: [
            { name: 'Webpage', url: 'https://casperlabs.io', icon:'<i class="fas fa-globe-americas"></i>' },
            { name: 'Telegram', url: 'https://t.me/casperlabs', icon:'<i class="fab fa-telegram"></i>' },
            { name: 'Discord', url: 'https://discord.gg/Q38s3Vh', icon:'<i class="fab fa-discord"></i>' },
            { name: 'Twitter', url: 'https://twitter.com/meetCasperLabs', icon:'<i class="fab fa-twitter"></i>' },
        ]
    },
    {
        logo: 'dogecash2.png',
        title: 'DogeCash',
        slogan: 'Who says you can’t teach an old doge new tricks ?',
        description: 'Transparent, community governed cryptocurrency aimed at preserving what makes DogeCoin unique while offering an alternative way for the average investor to get involved. This is done through the creation of DogeNodes, utilization of Proof of Stake, and active governance.',
        mediaLinks: [
            { name: 'Webpage', url: 'https://dogec.io', icon:'<i class="fas fa-globe-americas"></i>' },
            { name: 'Telegram', url: 'https://t.me/dogecashcoin', icon:'<i class="fab fa-telegram"></i>' },
            { name: 'Discord', url: 'https://discord.gg/7rZ8jn', icon:'<i class="fab fa-discord"></i>' },
            { name: 'Twitter', url: 'https://twitter.com/dogecashcoin', icon:'<i class="fab fa-twitter"></i>' },
            { name: 'Stats', url: 'https://coinmarketcap.com/currencies/dogecash/', icon:'<i class="fas fa-chart-line"></i>' },
        ]
    },
    {
        logo: 'elrond2.png',
        title: 'Elrond',
        slogan: 'Developers, validators and businesses use Elrond to build a new internet economy.',
        description: 'Give anyone, anywhere easy access to the digital economy, by bringing a 1000x improvement in blockchain speed, scale, cost and user. experience.',
        mediaLinks: [
            { name: 'Webpage', url: 'https://elrond.com', icon:'<i class="fas fa-globe-americas"></i>' },
            { name: 'Telegram', url: 'https://t.me/ElrondNetwork', icon:'<i class="fab fa-telegram"></i>' },
            { name: 'Twitter', url: 'https://twitter.com/elrondnetwork', icon:'<i class="fab fa-twitter"></i>' },
            { name: 'Stats', url: 'https://dropstab.com/elrond-erd-2', icon:'<i class="fas fa-chart-line"></i>' },
        ]
    },
    {
        logo: 'solana1.png',
        title: 'Solana',
        slogan: 'Web-Scale Blockchain',
        description: 'For fast, secure, scalable, decentralized apps and marketplaces. Don’t choose between scale, security, and decentralization. Solana has solved the trilemma for you. No sharding required.',
        mediaLinks: [
            { name: 'Webpage', url: 'https://solana.com', icon:'<i class="fas fa-globe-americas"></i>' },
            { name: 'Telegram', url: 'https://t.me/solanaio', icon:'<i class="fab fa-telegram"></i>' },
            { name: 'Discord', url: 'https://discord.gg/q64Kz8', icon:'<i class="fab fa-discord"></i>' },
            { name: 'Twitter', url: 'https://twitter.com/solana', icon:'<i class="fab fa-twitter"></i>' },
            { name: 'Stats', url: 'https://dropstab.com/solana', icon:'<i class="fas fa-chart-line"></i>' },
        ]
    },

];

const description = `cloud architect and site reliability engineer with over a decade of intense professional experience strictly adhering to DevOps methodology. He has architected and built multiple platform-agnostic infrastructures from scratch for modern cloud systems`;

new TypeIt("#header-description", {
    strings: "",
    speed: 10,
    lifeLike: true,
    cursor: true,
    cursorSpeed: 10,
    waitUntilVisible: true,
    cursorChar: '█',
    afterComplete: async (step, instance) => {
        instance.destroy();
    }
})
    .type(description, { delay: 1000 })
    .go();

let projectId = 1;
function nextId() {
    return `pid-${projectId++}`;
}

function typeText(id, text, delay) {
    function addText(t, text) {
        const words = text.split(' ');
        words.forEach(w => {
            const typo = (Math.random() < 0.30 && w.length > 4);

            const d = Math.floor(Math.random() * 30 + 60);
            const s = Math.floor(Math.random() * 20 + 30);
            if (!typo) {
                t.type(`${w} `, { speed: s, delay: d });
            }
            else {
                const typoAt = Math.floor(w.length / 2);
                const w1 = w.substring(0, typoAt);
                const w2 = w.substring(typoAt);
                t.type(`${w1}`, { speed: s, delay: d });
                t.type(`${w2[0]}`, { speed: s, delay: d });
                t.delete(1, { speed: s, delay: d });
                t.type(`${w2} `, { speed: s, delay: d });
            }
        });


    }
    setTimeout(() => {
        const t =
            new TypeIt(`#${id}`, {
                strings: "",
                speed: 50,
                lifeLike: true,
                waitUntilVisible: true,
                cursorChar: '█',
                afterComplete: async (step, instance) => {
                    instance.destroy();
                }
            });
        addText(t, text);
        t.go();

    }, delay);
}


projects.forEach((p, i) => {
    const x = $('#project-template').clone();
    const id1 = nextId();
    const id2 = nextId();
    const id3 = nextId();
    x.find('.cmd-title').attr('id', id1);
    x.find('.cmd-slogan').attr('id', id2);
    x.find('.cmd-description').attr('id', id3);
    x.removeClass('d-none');
    x.find('.project-logo').append($(`<img src="assets/images/${p.logo}">`));
    $('.main-content').append(x);
    $(`#${id1}`).html(p.title);
    $(`#${id2}`).html(p.slogan);
    p.mediaLinks.forEach(l => {
        x.find('.media-links').append(`<a class="media-link" href="${l.url}" target="_blank">${l.icon}</a>`);
    });
    typeText(id3, p.description, i * 1000);

});

