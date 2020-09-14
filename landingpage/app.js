/*
    CHANGE history:
    
    2020-09-14.4:
    * no console typing for title + slogan

    2020-09-14.3:
    * center header, main and footer content
    * adjust colors (green text, background color)
    * card layout -> console only in description
    * version number added in upper left corner
*/

$('.version').html('version: 2020-09-14.4');

const projects = [
    {
        logo: 'blocknet1.png',
        title: 'BLOCK',
        slogan: 'Internet of Blockchains',
        description: 'Blocknet is a blockchain interoperability protocol that enables communication, interaction, and exchange between different public and private blockchains, as well as on-chain access to off-chain data, APIs, and services via oracles.'
    },
    {
        logo: 'casperlabs3.png',
        title: 'Casperlabs',
        slogan: 'Blockchain for the builders',
        description: 'Build unstoppable businesses on the truly scalable, simple to use, and always secure blockchain and smart contracting platform.'
    },
    {
        logo: 'dogecash2.png',
        title: 'DogeCash',
        slogan: 'Who says you can’t teach an old doge new tricks ?',
        description: 'Transparent, community governed cryptocurrency aimed at preserving what makes DogeCoin unique while offering an alternative way for the average investor to get involved. This is done through the creation of DogeNodes, utilization of Proof of Stake, and active governance.'
    },
    {
        logo: 'elrond2.png',
        title: 'Elrond',
        slogan: 'Developers, validators and businesses use Elrond to build a new internet economy.',
        description: 'Give anyone, anywhere easy access to the digital economy, by bringing a 1000x improvement in blockchain speed, scale, cost and user. experience.'
    },
    {
        logo: 'solana1.png',
        title: 'Solana',
        slogan: 'Web-Scale Blockchain',
        description: 'For fast, secure, scalable, decentralized apps and marketplaces. Don’t choose between scale, security, and decentralization. Solana has solved the trilemma for you. No sharding required.'
    },

];

const description = `cloud architect and site reliability engineer with over a decade of intense professional experience strictly adhering to DevOps methodology. He has architected and built multiple platform-agnostic infrastructures from scratch for modern cloud systems`;

new TypeIt("#header-description", {
    strings: "",
    speed: 20,
    lifeLike: true,
    cursor: true,
    waitUntilVisible: true,
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

function typeText(id, text, speed, delay) {
    setTimeout(() => {
        new TypeIt(`#${id}`, {
            strings: "",
            speed: speed,
            lifeLike: true,
            cursor: true,
            waitUntilVisible: true,
            afterComplete: async (step, instance) => {
                instance.destroy();
            }
        })
            .type(text)
            .go();
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
    //typeText(id1, p.title, 200, i*100);
    //typeText(id2, p.slogan, 100, i*500);
    $(`#${id1}`).html(p.title);
    $(`#${id2}`).html(p.title);
    typeText(id3, p.description, 50, i*1000);

});

