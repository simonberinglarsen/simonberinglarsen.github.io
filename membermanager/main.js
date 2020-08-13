// global array defining all admin users
//=======================================================================================================================
const admins = [
    {
        adminID: "a001",
        password: "pw001",
        userRole: "Administrator"
    },
];

// global array defining all members
//=======================================================================================================================
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
//=======================================================================================================================
const appState = {
    loggedInUser: null,
};

// toggle whether or not to show a specific html element (given by id)
//=======================================================================================================================
function isVisible(id, show) {
    document.getElementById(id).setAttribute("style", show ? "" : "display:none")
}

// gets the text from a text field on the site
//=======================================================================================================================
function getText(id) {
    return document.getElementById(id).value;
}

// loads the member into the form so it can be edited
//=======================================================================================================================
function edit(memid) {
    const member = members.find(m => m.memID === memid);
    document.getElementById('memId').value = member.memID;
    document.getElementById('memName').value = member.memName;
    document.getElementById('memDob').value = member.memDob;
    document.getElementById('memAddress').value = member.memAddress;
    document.getElementById('memMobile').value = member.memMobile;
    document.getElementById('memAge').value = member.memAge;
    updateApp();
}

// takes the id and searches all mebers .. if found it will be deleted
//=======================================================================================================================
function deleteMember(memid) {
    const existingMember = members.find(m => m.memID === memid);
    if (existingMember) {
        members.splice(members.indexOf(existingMember), 1);
    }
    updateApp();
}

// renders the member table in html based on the javascript arrays
//=======================================================================================================================
function renderUserTable() {
    const mapToRow = (member) => `<tr>   
    <td>${member.memID}</td>
    <td>${member.memName}</td>
    <td>${member.memDob}</td>
    <td>${member.memAddress}</td>
    <td>${member.memMobile}</td>
    <td>${member.memAge}</td>
    <td><button onclick="edit('${member.memID}')">edit</button><button onclick="deleteMember('${member.memID}')">del</button></td></tr>`;
    document.getElementById('userTable').tBodies[0].innerHTML = `${members.map(m => mapToRow(m)).join('')}`;
}

// updates the application - keeps track of what to show and what to hide. Also updating dynamic things based on application state (appState)
//=======================================================================================================================
function updateApp() {
    members.sort((a, b) => a.memID < b.memID ? -1 : 1);
    isVisible('loginScreen', !appState.loggedInUser);
    isVisible('loginValidation', appState.invalidUser);
    isVisible('memberAdminScreen', appState.loggedInUser);
    if (appState.loggedInUser) {
        document.getElementById('btnLogout').innerText = `Logout (${appState.loggedInUser.adminID})`;
        renderUserTable();
    }

}

// button to logout admin user. this method updates the state and calls the updateapp method to reflect changes
//=======================================================================================================================
function btnLogoutClick() {
    appState.loggedInUser = null;
    appState.invalidUser = false;
    updateApp();
}

// adds a new member to the array by reading the input and creating a new object to be pushed
//=======================================================================================================================
function btnAddClick() {
    const existingMember = members.find(m => m.memID === getText('memId'));
    if (existingMember) {
        members.splice(members.indexOf(existingMember), 1);
    }
    members.push({
        memID: getText('memId'),
        memName: getText('memName'),
        memDob: getText('memDob'),
        memAddress: getText('memAddress'),
        memMobile: getText('memMobile'),
        memAge: getText('memAge'),
    });
    updateApp();
}

// clears the fields by setting the value to empty string
//=======================================================================================================================
function btnClearClick() {
    ['memId', 'memName', 'memDob', 'memAddress', 'memMobile', 'memAge'].forEach(e => document.getElementById(e).value = '');
}

// button to login. gets the username and password from the text boxes and see if there is a matching user in the global array.
// in the end the application state is updated and the updateApp() method makes sure to hide/show the right stuff
//=======================================================================================================================
function btnLoginClick() {
    let user = getText('loginUser');
    let pass = getText('loginPassword');
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
//appState.loggedInUser = admins[0];
updateApp();