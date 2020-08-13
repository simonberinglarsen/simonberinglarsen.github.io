// global array defining all admin users
const admins = [
    {
        adminID: "a001",
        password: "pw001",
        userRole: "Administrator"
    },
];

// global array defining all members
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

// application state - keeps track of things we save accross screens
const appState = {
    loggedInUser: null,
};

// toggle whether or not to show a specific html element (given by id)
function isVisible(id, show) {
    document.getElementById(id).setAttribute("style", show ? "" : "display:none")
}

// renders the member table in html based on the javascript arrays
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

// updates the application - keeps track of what to show and what to hide. Also updating dynamic things based on application state (appState)
function updateApp() {
    isVisible('loginScreen', !appState.loggedInUser);
    isVisible('loginValidation', appState.invalidUser);
    isVisible('memberAdminScreen', appState.loggedInUser);
    if (appState.loggedInUser) {
        document.getElementById('btnLogout').innerText = `Logout (${appState.loggedInUser.adminID})`;
        renderUserTable();
    }

}

// button to logout admin user. this method updates the state and calls the updateapp method to reflect changes
document.getElementById('btnLogout').onclick = function () {
    appState.loggedInUser = null;
    appState.invalidUser = false;
    updateApp();
}

// button to login. gets the username and password from the text boxes and see if there is a matching user in the global array.
// in the end the application state is updated and the updateApp() method makes sure to hide/show the right stuff
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

// this updates the initial state of the app.
updateApp();