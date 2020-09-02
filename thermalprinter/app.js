$('head').prepend(`<style>

@font-face {
    font-family: 'Free 3 of 9 Extended';
    src: url('LibreBarcode39Extended-Regular.ttf') format('truetype');
}

body {
    background-color : #444;
}

.all-layouts {
    all: unset;
}

.container {
    background-color: #fff;
}

button {
    padding: 10px;
    font-size: 15px;
    font-weight: bold;
}

.container.show {
    margin-top: 30px;
}

</style>`);
let originalHtml = $('.all-layouts').html();
let logoText;
const buttons = $('<div></div>');
const allCompanies = [
    'casco',
    'pando',
    'colmenar',
    'dummy'];
allCompanies.forEach((c, i) => {
    let id = `company_${c}`;
    $(`<button>${c}</button>`).appendTo(buttons).click(() => {
        showCompany([[`%${id}%`, 'show']]);
    });
});
$(`<button>all</button>`).appendTo(buttons).click(() => {
    showCompany(allCompanies.map(c => [`%company_${c}%`, 'show']));
});
$('body').prepend(buttons);

$.get('logo.txt', (text) => {
    logoText = text;
});
function showCompany(extra) {
    const replaceMap = [
        ['%Razón_Social%', 'Santa Martina S.R.L.'],
        ['%RUT%', '217578720016'],
        ['%Dirección%', 'Lavalleja 501, Soriano'],
        ['%Teléfono%', 'Tel. 4531 6881'],
        ['%Logo%', logoText],
        ['%Total%', 'Total: $ 25,00'],
        ['%Observaciones%', 'Este ticket solo será valido hasta el 03/09/2020'],
        ['%Código_Barras%', '*DE14147*'],
        ['%Detalle%', '1 x ENVASE GENERICOS'],
    ];

    (extra || []).forEach(item => {
        replaceMap.push(item)
    });

    let html = originalHtml;
    replaceMap.forEach((v) => {
        html = html.split(v[0]).join(v[1]);
    });
    $('.all-layouts').html(html);
}