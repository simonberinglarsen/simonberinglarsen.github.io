/* -------MULTI SELECT START -------- */
function Multiselect(all, htmlFrom, htmlTo, htmlFromCount, htmlToCount, htmlInput) {
    this.search = '';
    this.fromList = [...all];
    this.toList = [];
    this.htmlFrom = htmlFrom;
    this.htmlTo = htmlTo;
    this.htmlFromCount = htmlFromCount;
    this.htmlToCount = htmlToCount;
    htmlInput.keyup((e) => {
        setTimeout(() => {
            this.search = e.currentTarget.value;
            this.updateui();
        }, 0);
    });
    this.updateui();
}

Multiselect.prototype.clickHandler = function (e) {
    const id = $(e.currentTarget).data('id')
    const model = allModels.find(m => m.id === id);

    if (this.fromList.find(m => m === model)) {
        this.fromList = this.fromList.filter(m => m !== model);
        this.toList.push(model);
    }
    else {
        this.toList = this.toList.filter(m => m !== model);
        this.fromList.push(model);

    }
    this.updateui();
}

Multiselect.prototype.renderItems = function (list, models) {
    models = models.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    list.empty();
    models.forEach(n => {
        const item = $(`
        <div class="item">
            <div>
                <img class="profile-img" src="${n.profileUrl}">
            </div>
            <div class="item-name">
                <div>${n.name}</div>
            </div>
        </div>`);
        item.attr('data-id', n.id);
        list.append(item);
        item.click((e) => { this.clickHandler(e); });
    });
}

Multiselect.prototype.updateui = function () {
    const filteredFromList = this.fromList.filter(n => n.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0);
    this.renderItems($('#from'), filteredFromList);
    this.renderItems($('#to'), this.toList);
    this.htmlFromCount.html(this.fromList.length);
    this.htmlToCount.html(this.toList.length);
}
/* -------MULTI SELECT END -------- */

const allModels = `
Letty Esterly  
Kali Bunch  
Armando Bogard  
Alexandra River  
Floyd Garzon  
Keenan Tackett  
Celina Replogle  
Rosaline Andreasen  
Bulah Estrella  
Adan Weekley  
Pamela Zubia  
Kiara Migues  
Brittaney Judson  
Alyse Mourer  
Carlee Cassese  
Jamey Kwan  
Annamae Trotta  
Clarisa Bryson  
Marry Aker  
Daniel Fleagle  
Consuela Heinen  
Gaylene Clouser  
Irving Lear  
Doloris Weathers  
Tania Meza  
Barrie Whitfield  
Rolando Bruso  
Lucille Kocher  
Sheryll Wind  
Angila Steffes  
Shirely Tennison  
Cuc Klimek  
Noella Lukens  
Nelle Bernier  
Temple Sidebottom  
Jeni Vaughns  
Nathalie Tabb  
Darby Chiodo  
Otis Zuk  
Jacob Callejas  
Syreeta Mccrary  
Rusty Barnum  
Irma Glasper  
Marcelina Krupp  
Trenton Luellen  
Moshe Mumford  
Cathy Luczynski  
Leopoldo Coles  
Tama Vanwagoner  
Essie Gaulke`.split(/\r?\n/).filter(n => !!n).map((n, i) =>
    ({
        'id': i,
        'name': n.trim(),
        'profileUrl': i%2 ? `https://randomuser.me/api/portraits/thumb/men/${i+1}.jpg` : `https://randomuser.me/api/portraits/thumb/women/${i+1}.jpg`
    }));
const multiselect = new Multiselect(
    allModels,
    $('#from'),
    $('#to'),
    $('#fromCount'),
    $('#toCount'),
    $("input"));