$('.version').html('version: 2020-09-21.2');

/*
    CHANGE history:

    2020-09-21.2
    * background color transparency
    * disabled animations on mobile

    2020-09-20.1:
    * final text changes

    2020-09-19.1:
    * responsive design

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

AOS.init({disable: 'mobile'});

let globalId = 1;
const description = [
    `Our international decentralized team is scattered around the globe, but united by same passion.`,
    `We encourage and support professional blockchain developers and scientists in the fields of mathematics, cryptography, programming languages and related interdisciplinary sub-fields, by using high-standard, industry quality tools and skills.`,
    `Blockchain technology, smart contracts and cryptography are fast becoming an essential part of the modern world.`,
    `It seems there are more blockchains around than croissants in France, who each have their own specific properties, applications and possibilities. Sadly, most of those croissants won't be around anymore in the foreseeable future.On the internet within each specific niche it is usually a winner - takes - all situation.`,
    `Nevertheless, we did extensive research into each competitive candidate to decide which ones serve a purpose. By sharing our knowledge we help developers and scientists make informed decisions onto which blockchains they would want to unleash their brain product and how to approach the ecosystem in which it should live and thrive.`,
    `We help build castles on a blockchain.`,
].map(x => `${x}<br/><br/>`).join('');
const projects = [
    {
        logo: 'blocknet1.png',
        title: 'BlockNet',
        slogan: 'Internet of Blockchains',
        description: 'Blocknet is a blockchain interoperability protocol that enables communication, interaction, and exchange between different public and private blockchains, as well as on-chain access to off-chain data, APIs, and services via oracles.',
        mediaLinks: [
            { name: 'Webpage', url: 'https://blocknet.co', icon: '<i class="fas fa-globe-americas"></i>' },
            { name: 'Telegram', url: 'https://t.me/Blocknet', icon: '<i class="fab fa-telegram"></i>' },
            { name: 'Discord', url: 'https://discord.gg/jydgk2', icon: '<i class="fab fa-discord"></i>' },
            { name: 'Twitter', url: 'https://twitter.com/The_Blocknet', icon: '<i class="fab fa-twitter"></i>' },
            { name: 'Stats', url: 'https://dropstab.com/blocknet', icon: '<i class="fas fa-chart-line"></i>' },
        ]
    },
    {
        logo: 'casperlabs.svg',
        title: 'Casperlabs',
        slogan: 'Blockchain for the builders',
        description: 'Build unstoppable businesses on the truly scalable, simple to use, and always secure blockchain and smart contracting platform.',
        mediaLinks: [
            { name: 'Webpage', url: 'https://casperlabs.io', icon: '<i class="fas fa-globe-americas"></i>' },
            { name: 'Telegram', url: 'https://t.me/casperlabs', icon: '<i class="fab fa-telegram"></i>' },
            { name: 'Discord', url: 'https://discord.gg/Q38s3Vh', icon: '<i class="fab fa-discord"></i>' },
            { name: 'Twitter', url: 'https://twitter.com/meetCasperLabs', icon: '<i class="fab fa-twitter"></i>' },
        ]
    },
    {
        logo: 'dogecash2.png',
        title: 'DogeCash',
        slogan: 'Who says you can’t teach an old doge new tricks ?',
        description: 'Transparent, community governed cryptocurrency aimed at preserving what makes DogeCoin unique while offering an alternative way for the average investor to get involved. This is done through the creation of DogeNodes, utilization of Proof of Stake, and active governance.',
        mediaLinks: [
            { name: 'Webpage', url: 'https://dogec.io', icon: '<i class="fas fa-globe-americas"></i>' },
            { name: 'Telegram', url: 'https://t.me/dogecashcoin', icon: '<i class="fab fa-telegram"></i>' },
            { name: 'Discord', url: 'https://discord.gg/7rZ8jn', icon: '<i class="fab fa-discord"></i>' },
            { name: 'Twitter', url: 'https://twitter.com/dogecashcoin', icon: '<i class="fab fa-twitter"></i>' },
            { name: 'Stats', url: 'https://coinmarketcap.com/currencies/dogecash/', icon: '<i class="fas fa-chart-line"></i>' },
        ]
    },
    {
        logo: 'elrond2.png',
        title: 'Elrond',
        slogan: 'Developers, validators and businesses use Elrond to build a new internet economy.',
        description: 'Give anyone, anywhere easy access to the digital economy, by bringing a 1000x improvement in blockchain speed, scale, cost and user. experience.',
        mediaLinks: [
            { name: 'Webpage', url: 'https://elrond.com', icon: '<i class="fas fa-globe-americas"></i>' },
            { name: 'Telegram', url: 'https://t.me/ElrondNetwork', icon: '<i class="fab fa-telegram"></i>' },
            { name: 'Twitter', url: 'https://twitter.com/elrondnetwork', icon: '<i class="fab fa-twitter"></i>' },
            { name: 'Stats', url: 'https://dropstab.com/elrond-erd-2', icon: '<i class="fas fa-chart-line"></i>' },
        ]
    },
    {
        logo: 'solana1.png',
        title: 'Solana',
        slogan: 'Web-Scale Blockchain',
        description: 'For fast, secure, scalable, decentralized apps and marketplaces. Don’t choose between scale, security, and decentralization. Solana has solved the trilemma for you. No sharding required.',
        mediaLinks: [
            { name: 'Webpage', url: 'https://solana.com', icon: '<i class="fas fa-globe-americas"></i>' },
            { name: 'Telegram', url: 'https://t.me/solanaio', icon: '<i class="fab fa-telegram"></i>' },
            { name: 'Discord', url: 'https://discord.gg/q64Kz8', icon: '<i class="fab fa-discord"></i>' },
            { name: 'Twitter', url: 'https://twitter.com/solana', icon: '<i class="fab fa-twitter"></i>' },
            { name: 'Stats', url: 'https://dropstab.com/solana', icon: '<i class="fas fa-chart-line"></i>' },
        ]
    },

];

$('#header-description').html(description);

function nextId() {
    return `element-${globalId++}`;
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

function navigateTo(url) {
    var a = document.createElement('a');
    a.target = "_blank";
    a.href = url;
    a.click();
}

projects.forEach((p, i) => {
    const t = $('#project-template').clone();
    const [titleId, sloganId, descriptionId] = [nextId(), nextId(), nextId()];
    t.find('.cmd-title').attr('id', titleId);
    t.find('.cmd-slogan').attr('id', sloganId);
    t.find('.cmd-description').attr('id', descriptionId);
    t.removeClass('d-none');
    t.find('.project-logo').append($(`<img src="assets/images/${p.logo}">`));
    t.find('.project-logo').click(() => {
        const homepage = p.mediaLinks.find(l => l.name === 'Webpage');
        if (!homepage) {
            return;
        }
        navigateTo(homepage.url);
    });
    p.mediaLinks.forEach(l => {
        t.find('.media-links').append(`<a class="media-link" href="${l.url}" target="_blank">${l.icon}</a>`);
    });
    $('.main-content').append(t);
    $(`#${titleId}`).html(p.title);
    $(`#${sloganId}`).html(p.slogan);
    typeText(descriptionId, p.description, i * 1000);
});

