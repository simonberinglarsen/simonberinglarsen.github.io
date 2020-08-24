console.clear();

let team = [];

const teamMale = [
    {
        rank: 1,
        name: 'Lewis Hamilton',
        handle: 'lewishamilton',
        img: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col-retina/image.png',
        kudos: 36,
        games: 31,
    },
    {
        rank: 2,
        name: 'Kimi Raikkonen',
        handle: 'kimimatiasraikkonen',
        img: 'https://www.formula1.com/content/dam/fom-website/drivers/K/KIMRAI01_Kimi_R%C3%A4ikk%C3%B6nen/kimrai01.png.transform/2col-retina/image.png',
        kudos: 31,
        games: 21
    },
    {
        rank: 3,
        name: 'Sebastian Vettel',
        handle: 'vettelofficial',
        img: 'https://www.formula1.com/content/dam/fom-website/drivers/S/SEBVET01_Sebastian_Vettel/sebvet01.png.transform/2col-retina/image.png',
        kudos: 24,
        games: 7
    },
    {
        rank: 4,
        name: 'Max Verstappen',
        handle: 'maxverstappen1',
        img: 'https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col-retina/image.png',
        kudos: 22,
        games: 4
    },
    {
        rank: 5,
        name: 'Lando Norris',
        handle: 'landonorris',
        img: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col-retina/image.png',
        kudos: 18,
        games: 16
    },
    {
        rank: 6,
        name: 'Charles Leclerc',
        handle: 'charles_leclerc',
        img: 'https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col-retina/image.png',
        kudos: 16,
        games: 6
    },
    {
        rank: 7,
        name: 'George Russell',
        handle: 'georgerussell63',
        img: 'https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col-retina/image.png',
        kudos: 10,
        games: 21
    },
    {
        rank: 8,
        name: 'Daniel Ricciardo',
        handle: 'danielricciardo',
        img: 'https://www.formula1.com/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png.transform/2col-retina/image.png',
        kudos: 7,
        games: 46
    },
    {
        rank: 9,
        name: 'Alexander Albon',
        handle: 'alex_albon',
        img: 'https://www.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/2col-retina/image.png',
        kudos: 4,
        games: 2
    },
    {
        rank: 10,
        name: 'Carlos Sainz Jr.',
        handle: 'carlossainz55',
        img: 'https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col-retina/image.png',
        kudos: 1,
        games: 24
    }];

const teamFemale = teamMale.map(x => {
    return { ...x, name: `(f)${x.name}` };
});


function toggleButton(b1, b2) {
    let c1 = btnMale.getAttribute("class")
    let c2 = btnFemale.getAttribute("class")
    btnMale.setAttribute("class", c2)
    btnFemale.setAttribute("class", c1)
}

btnMale.onclick = function () {
    toggleButton(btnMale, btnFemale);
    update(teamMale);
}

btnFemale.onclick = function () {
    toggleButton(btnMale, btnFemale);
    update(teamFemale);
}

const randomEmoji = () => {
    const emojis = ['👏', '👍', '🙌', '🤩', '🔥', '⭐️', '🏆', '💯'];
    let randomNumber = Math.floor(Math.random() * emojis.length);
    return emojis[randomNumber];
};

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function update(team) {
    // Find Winner from sent kudos by sorting the drivers in the team array
    team.forEach(member => {
        member.total = member.games + member.kudos;
    });
    let sortedTeam = team.sort((a, b) => b.total - a.total)
    sortedTeam.map((x, i) => { x.rank = i + 1; });
    for (let i = 1; i < sortedTeam.length; i++) {
        if (sortedTeam[i].total === sortedTeam[i - 1].total) {
            sortedTeam[i].rank = sortedTeam[i - 1].rank;
        }
    }

    let winner = sortedTeam[0];
    list.innerHTML = ''
    let header = htmlToElement(` <li class="c-list__item">
    <div class="c-list__grid">
        <div class="u-text--left u-text--small u-text--medium">Rank</div>
        <div class="u-text--left u-text--small u-text--medium">Team Member</div>
        <div class="u-display--flex flex-row">
            <div class="u-text--right u-text--small u-text--medium w-60"># Kudos</div>
            <div class="u-text--right u-text--small u-text--medium w-60"># Games</div>
            <div class="u-text--right u-text--small u-text--medium w-60"># Total</div>
        </div>
    </div>
</li>`);
    list.appendChild(header);
    team.forEach(member => {
        let newRow = document.createElement('li');
        newRow.classList = 'c-list__item';
        newRow.innerHTML = `
		<div class="c-list__grid">
			<div class="c-flag c-place u-bg--transparent">${member.rank}</div>
			<div class="c-media">
				<img class="c-avatar c-media__img" src="${member.img}" />
				<div class="c-media__content">
					<div class="c-media__title">${member.name}</div>
					<a class="c-media__link u-text--small" href="https://instagram.com/${member.handle}" target="_blank">@${member.handle}</a>
				</div>
			</div>
            <div class="u-text--right c-kudos">
                <div class="u-display--flex flex-row">
                    <div class="u-mt--8  w-60">
                        <strong>${member.kudos}</strong>
                    </div>
                    <div class="u-mt--8  w-60">
                        <strong>${member.games}</strong>
                    </div>
                    <div class="u-mt--8  w-60">
                        <strong>${member.total}</strong> ${randomEmoji()}
                    </div>
                </div>
			</div>
		</div>
	`;
        if (member.rank === 1) {
            newRow.querySelector('.c-place').classList.add('u-text--dark');
            newRow.querySelector('.c-place').classList.add('u-bg--yellow');
            newRow.querySelector('.c-kudos').classList.add('u-text--yellow');
        } else if (member.rank === 2) {
            newRow.querySelector('.c-place').classList.add('u-text--dark');
            newRow.querySelector('.c-place').classList.add('u-bg--teal');
            newRow.querySelector('.c-kudos').classList.add('u-text--teal');
        } else if (member.rank === 3) {
            newRow.querySelector('.c-place').classList.add('u-text--dark');
            newRow.querySelector('.c-place').classList.add('u-bg--orange');
            newRow.querySelector('.c-kudos').classList.add('u-text--orange');
        }

        list.appendChild(newRow);
    });

    // Render winner card
    const winnerCard = document.getElementById('winner');
    winnerCard.innerHTML = `
	<div class="u-text-small u-text--medium u-mb--16">Top Sender Last Week</div>
	<img class="c-avatar c-avatar--lg" src="${winner.img}"/>
	<h3 class="u-mt--16">${winner.name}</h3>
	<span class="u-text--teal u-text--small">${winner.name}</span>
`;
}
update(teamFemale);