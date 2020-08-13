const admins = [
    {
        adminID: "a001",
        password: "pw001",
        userRole: "Administrator"
    },
];

const members = [
    {
        memID: "m001",
        memName: "amy Koh",
        memDob: "16 June 1980",
        memAddress: "500 woodlands RD #01-11. S411000",
        memMobile: "98765432",
        memAge: 29,
    },
    {
        memID: "m002",
        memName: "john Doe",
        memDob: "26 June 1985",
        memAddress: "501 woodlands RD #01-11. S411000",
        memMobile: "11765432",
        memAge: 31,
    }

];

const appState = {
    loggedInUser: null,

};

function isVisible(id, show) {
    document.getElementById(id).setAttribute("style", show ? "" : "display:none")
}

function renderUserTable() {
    const mapToRow  = (member) => `<tr>   
    <th>${member.memID}</th>
    <td>${member.name}</td>
    <td>${member.memDob}</td>
    <td>${member.memAddress}</td>
    <td>${member.memMobile}</td>
    <td>${member.memAge}</td></tr>`;

    document.getElementById('userTable').tBodies[0].innerHTML = `${members.map(m => mapToRow(m)).join('')}`;
    
}

function updateApp() {
    isVisible('loginScreen', !appState.loggedInUser);
    isVisible('loginValidation', appState.invalidUser);
    isVisible('memberAdminScreen', appState.loggedInUser);
    if (appState.loggedInUser) {
        renderUserTable();
    }

}

document.getElementById('btnLogout').onclick = function () {
    appState.loggedInUser = null;
    appState.invalidUser = false;
    updateApp();
}

document.getElementById('btnLogin').onclick = function () {
    let user = document.getElementById('loginUser').value;
    let pass = document.getElementById('loginPassword').value;
    let admUser = admins.find(admUser => admUser.adminID === user && admUser.password === pass);
    if (!admUser) {
        appState.loggedInUser = null;
        appState.invalidUser = true;
    } else {
        appState.loggedInUser = admUser;
        appState.invalidUser = false;
    }
    updateApp();
}

appState.loggedInUser = {}
updateApp();