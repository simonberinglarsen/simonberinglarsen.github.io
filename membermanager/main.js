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
    }
];

const appState = {
    loggedInUser: null,
    
};

function isVisible(id, show) {
    document.getElementById(id).setAttribute("style", show ? "" : "display:none")
}

function updateApp() {
    isVisible('loginScreen', !appState.loggedInUser);
    isVisible('loginValidation', appState.invalidUser);
    
    isVisible('memberAdminScreen', appState.loggedInUser);
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


updateApp();