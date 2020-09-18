var b = 0; //To limit the turns
//Used for validating the player's turn

var ok = true;

var ruler = false; //for checking the dice got 6 dots and the player can use a token

var noA = false;
var noB = false;
var cMaster = "";
// Make array for containing dice images
const dice = [];
dice[0] = "img/One.png";
dice[1] = "img/Two.png";
dice[2] = "img/Three.png";
dice[3] = "img/Four.png";
dice[4] = "img/Five.png";
dice[5] = "img/Six.png";

//Array for assigning turns
const wTurn = [];
wTurn[0] = "gtoken";
wTurn[1] = "rtoken";
wTurn[2] = "btoken";
wTurn[3] = "ytoken";
//Used for looping through wTurn
turnLoop = 0;
//For assigning random numbers
var rNum1 = 0;
var rNum2 = 0;

// pValidator variables
var pCheck1;
var pCheck2;

// Current Turn Holder , Whose turn is this
var currentTurn;
var cTstring = "";

// Takes the dice boxes
const dice1 = document.querySelector("#dice1");
const dice2 = document.querySelector("#dice2");

//Takes the Center Clickable button
const btn = document.querySelector("#startTurn");

//Takes the default boxes for gtoken , rtoken, btoken and ytoken
const gtc = document.querySelectorAll(".p1TokenBox");
const rtc = document.querySelectorAll(".p2TokenBox");
const btc = document.querySelectorAll(".p3TokenBox");
const ytc = document.querySelectorAll(".p4TokenBox");

//Takes all the vip boxes where specified token can enter only
const vipB = document.querySelectorAll(".vip");

//Takes all selectable boxes
const all = document.querySelectorAll(".nBox,.sBox");
//Takes all nBoxes
const nBox = document.querySelectorAll(".nBox");
// Takes all Player Big/Main Boxes
const pBox = document.querySelectorAll(".pBox");
// Takes the center box
const center = document.querySelector("#center");

//Checks How much boxes are selected
var n = 0;

//Checks whether game is started or not
var gCheck = false;

// Temporary Token Store
var tokenCarry;

// Stores which to select
var selectIt;

//Listener for nBoxes / little boxes
for (let i = 0; i < all.length; i++) {
  all[i].addEventListener("click", selecter);
}
//Listener For pBoxes / Bigger main boxes
for (let i = 0; i < pBox.length; i++) {
  pBox[i].addEventListener("click", pSelected);
}
//Listener For Center Box
center.addEventListener("click", tWin);
center.addEventListener("click", pSelected);
//Listener For Center Button
btn.addEventListener("click", startTurn);

// Function for making all boxes selectable (Max of 1 box can be selected at a time)
function selecter(e) {
  //If it has a token inside it
  if (e.target.className.search("token") != -1) {
    //make sure it is selecting the inner token
    if (e.target.parentNode.className.search("tSelect") != -1) {
      //checks if its parent has a class of tSelect
      e.target.parentNode.classList.remove("tSelect");
      tokenCarry = "";
      n--;
    } else if (n == 0) {
      //if it is not already selected then do this
      if (noA == false || noB == false) {
        e.target.parentNode.classList.add("tSelect");
        tokenCarry = e.target;
        curCarry = e.target.parentNode;
        n++;
      }
    } else if (n == 1) {
      //Check if the target token is in stop box
      if (e.target.parentNode.className.search("stop") != -1) {
        if (e.target.parentNode.childElementCount >= 1) {
          selectIt = e.target.parentNode;

          qValidator(tokenCarry);
          if (selectIt != pCheck1 && selectIt != pCheck2) {
            for (let u = 0; u < selectIt.children.length; u++) {
              if (
                selectIt.children[u].className.includes(cTstring) ==
                tokenCarry.className.includes(cTstring)
              ) {
                curCarry = tokenCarry.parentNode;
                tokenCarry = selectIt.children[0];
                curCarry.classList.remove("tSelect");
                selectIt.classList.add("tSelect");
              }
            }
          }

          if (qValidator(tokenCarry)) {
            e.target.parentNode.appendChild(tokenCarry);
            e.target.parentNode.background = "";
            curCarry.classList.remove("tSelect");
            tokenCarry = "";
            n--;
            curCarry = "";
            if (cMaster == "A") {
              noA = true;
            }
            if (cMaster == "B") {
              noB = true;
            }
            if (noA == true && noB == true) {
              gCheck = false;
            }
          }
        }
      } else if (
        //If target is not in stop box and we can check to kill him
        e.target.className.search("token") != -1 ||
        e.target.parentNode.className.search("token") != -1
      ) {
        if (n == 1) {
          selectIt = e.target.parentNode;
          //If it selects another box which is one of four player boxes then unselect current box and select that box
          if (selectIt.className.includes("sBox")) {
            curCarry = tokenCarry.parentNode;
            tokenCarry = selectIt.children[0];
            curCarry.classList.remove("tSelect");
            selectIt.classList.add("tSelect");
          }
          //If if select another box of same player then just exchange the "tSelect" property
          for (let u = 0; u < selectIt.children.length; u++) {
            if (
              selectIt.children[u].className.includes(cTstring) ==
              tokenCarry.className.includes(cTstring)
            ) {
              curCarry = tokenCarry.parentNode;
              tokenCarry = selectIt.children[0];
              curCarry.classList.remove("tSelect");
              selectIt.classList.add("tSelect");
            }
          }

          if (qValidator(tokenCarry)) {
            if (e.target.className.search("gtoken") != -1 && gCheck == true) {
              if (currentTurn != "gtoken") {
                var emptCheck;
                for (let i = 0; i < gtc.length; i++) {
                  if (gtc[i].childElementCount == 0) {
                    emptCheck = gtc[i];
                  }
                }
                tokenCarry.parentNode.classList.remove("tSelect");

                emptCheck.appendChild(e.target);
                this.appendChild(tokenCarry);

                if (cMaster == "A") {
                  noA = true;
                }
                if (cMaster == "B") {
                  noB = true;
                }
                if (noA == true && noB == true) {
                  gCheck = false;
                }

                selectIt.classList.add("tSelect");
                n = 1;

                tokenCarry = "";
                n--;
              }
            }
            if (e.target.className.search("rtoken") != -1) {
              if (currentTurn != "rtoken") {
                var emptCheck;
                for (let i = 0; i < rtc.length; i++) {
                  if (rtc[i].childElementCount == 0) {
                    emptCheck = rtc[i];
                  }
                }
                tokenCarry.parentNode.classList.remove("tSelect");

                emptCheck.appendChild(e.target);
                this.appendChild(tokenCarry);

                if (cMaster == "A") {
                  noA = true;
                }
                if (cMaster == "B") {
                  noB = true;
                }
                if (noA == true && noB == true) {
                  gCheck = false;
                }

                selectIt.classList.add("tSelect");
                n = 1;

                tokenCarry = "";
                n--;
              }
            }
            if (e.target.className.search("btoken") != -1) {
              if (currentTurn != "btoken") {
                var emptCheck;
                for (let i = 0; i < btc.length; i++) {
                  if (btc[i].childElementCount == 0) {
                    emptCheck = btc[i];
                  }
                }
                tokenCarry.parentNode.classList.remove("tSelect");

                emptCheck.appendChild(e.target);
                this.appendChild(tokenCarry);

                if (cMaster == "A") {
                  noA = true;
                }
                if (cMaster == "B") {
                  noB = true;
                }
                if (noA == true && noB == true) {
                  gCheck = false;
                }

                selectIt.classList.add("tSelect");
                n = 1;

                tokenCarry = "";
                n--;
              }
            }
            if (e.target.className.search("ytoken") != -1) {
              if (currentTurn != "ytoken") {
                var emptCheck;
                for (let i = 0; i < ytc.length; i++) {
                  if (ytc[i].childElementCount == 0) {
                    emptCheck = ytc[i];
                  }
                }
                tokenCarry.parentNode.classList.remove("tSelect");

                emptCheck.appendChild(e.target);
                this.appendChild(tokenCarry);

                if (cMaster == "A") {
                  noA = true;
                }
                if (cMaster == "B") {
                  noB = true;
                }
                if (noA == true && noB == true) {
                  gCheck = false;
                }

                selectIt.classList.add("tSelect");
                n = 1;

                tokenCarry = "";
                n--;
              }
            }
          }
          if (pvalidator()) {
            if (e.target.className.search("gtoken") != -1 && gCheck == true) {
              if (currentTurn != "gtoken") {
                var emptCheck;
                for (let i = 0; i < gtc.length; i++) {
                  if (gtc[i].childElementCount == 0) {
                    emptCheck = gtc[i];
                  }
                }
                tokenCarry.parentNode.classList.remove("tSelect");

                emptCheck.appendChild(e.target);
                this.appendChild(tokenCarry);

                if (cMaster == "A") {
                  noA = true;
                }
                if (cMaster == "B") {
                  noB = true;
                }
                if (noA == true && noB == true) {
                  gCheck = false;
                }

                tokenCarry = "";
                n--;
              }
            }
            if (e.target.className.search("rtoken") != -1) {
              if (currentTurn != "rtoken") {
                var emptCheck;
                for (let i = 0; i < rtc.length; i++) {
                  if (rtc[i].childElementCount == 0) {
                    emptCheck = rtc[i];
                  }
                }
                tokenCarry.parentNode.classList.remove("tSelect");

                emptCheck.appendChild(e.target);
                this.appendChild(tokenCarry);

                if (cMaster == "A") {
                  noA = true;
                }
                if (cMaster == "B") {
                  noB = true;
                }
                if (noA == true && noB == true) {
                  gCheck = false;
                }

                tokenCarry = "";
                n--;
              }
            }
            if (e.target.className.search("btoken") != -1) {
              if (currentTurn != "btoken") {
                var emptCheck;
                for (let i = 0; i < btc.length; i++) {
                  if (btc[i].childElementCount == 0) {
                    emptCheck = btc[i];
                  }
                }
                tokenCarry.parentNode.classList.remove("tSelect");

                emptCheck.appendChild(e.target);
                this.appendChild(tokenCarry);

                if (cMaster == "A") {
                  noA = true;
                }
                if (cMaster == "B") {
                  noB = true;
                }
                if (noA == true && noB == true) {
                  gCheck = false;
                }

                tokenCarry = "";
                n--;
              }
            }
            if (e.target.className.search("ytoken") != -1) {
              if (currentTurn != "ytoken") {
                var emptCheck;
                for (let i = 0; i < ytc.length; i++) {
                  if (ytc[i].childElementCount == 0) {
                    emptCheck = ytc[i];
                  }
                }
                tokenCarry.parentNode.classList.remove("tSelect");

                emptCheck.appendChild(e.target);
                this.appendChild(tokenCarry);

                if (cMaster == "A") {
                  noA = true;
                }
                if (cMaster == "B") {
                  noB = true;
                }
                if (noA == true && noB == true) {
                  gCheck = false;
                }

                tokenCarry = "";
                n--;
              }
            }
          }
        }
      }
    }
  }

  //If it is an empty Box
  if (e.target.className.search("nBox") != -1) {
    //checks if its parent has a class of tSelect
    if (e.target.className.search("tSelect") != -1) {
      e.target.classList.remove("tSelect");
      tokenCarry = "";
      n--;
    } else if (n == 0 || tokenCarry != "") {
      if (tokenCarry.className.includes(cTstring) == true && gCheck == true) {
        //check if it is coming from default positions
        if (tokenCarry.parentNode.className.search("nuN") != -1) {
          selectIt = e.target;
          if (pvalidator()) {
            e.target.appendChild(tokenCarry);
            for (let i = 0; i < all.length; i++) {
              all[i].classList.remove("tSelect");
            }
            e.target.classList.add("tSelect");
            n = 1;
            if (cMaster == "A") {
              noA = true;
            } else if (cMaster == "B") {
              noB = true;
            }
          }
        }
      }
      if (
        tokenCarry.parentNode.className.search("nuN") == -1 &&
        gCheck == true
      ) {
        //checks if it is no from default position;
        selectIt = e.target;
        //Assign the positions
        if (qValidator(tokenCarry)) {
          e.target.appendChild(tokenCarry);
          for (let i = 0; i < all.length; i++) {
            all[i].classList.remove("tSelect");
          }
          e.target.classList.add("tSelect");
          n = 1;
          if (cMaster == "A") {
            noA = true;
          }
          if (cMaster == "B") {
            noB = true;
          }
          if (noA == true && noB == true) {
            gCheck = false;
          }
        }
      }
    }
  }
}

// Function to unselect the boxes on clicking main Big boxes and Center
function pSelected() {
  for (let i = 0; i < all.length; i++) {
    all[i].classList.remove("tSelect");
    n = 0;
    tokenCarry = "";
  }
}

// Function to run on clicking the Center Button to generate random dice numbers
function startTurn() {
  if (b == 0) {
    tokenCarry = "";
    noA = false;
    noB = false;
    cMaster = "";
    selectIt = "";
    rNum1 = Math.floor(Math.random() * 6);
    dice1.style.backgroundImage = "url(" + dice[rNum1] + ")";
    rNum2 = Math.floor(Math.random() * 6);
    dice2.style.backgroundImage = "url(" + dice[rNum2] + ")";
    gCheck = true;
    if (gCheck == true) {
      turnAssign();
    }
    ok = false;
    b++;
  } else if (b > 0) {
    var myString = "";
    //checks if current token is already in nBoxes
    for (let j = 0; j < nBox.length; j++) {
      if (nBox[j].childElementCount > 0) {
        if (nBox[j].children[0].className.search(cTstring) != -1) {
          ok = true;
          break;
        }
      }
    }
    if (ok == true) {
      if (noA == true && noB == true) {
        tokenCarry = "";
        noA = false;
        noB = false;
        cMaster = "";
        selectIt = "";
        rNum1 = Math.floor(Math.random() * 6);
        dice1.style.backgroundImage = "url(" + dice[rNum1] + ")";
        rNum2 = Math.floor(Math.random() * 6);
        dice2.style.backgroundImage = "url(" + dice[rNum2] + ")";
        gCheck = true;
        if (gCheck == true) {
          turnAssign();
        }
        ok = false;
        return true;
      }
    }
    if (ok == false) {
      if (ruler == false && rNum1 != 5 && rNum2 != 5) {
        tokenCarry = "";
        noA = false;
        noB = false;
        cMaster = "";
        selectIt = "";
        rNum1 = Math.floor(Math.random() * 6);
        dice1.style.backgroundImage = "url(" + dice[rNum1] + ")";
        rNum2 = Math.floor(Math.random() * 6);
        dice2.style.backgroundImage = "url(" + dice[rNum2] + ")";
        gCheck = true;
        if (gCheck == true) {
          turnAssign();
          ok = false;
        }
      }
    }
  }
}

function turnAssign() {
  currentTurn = wTurn[turnLoop];
  cTstring = currentTurn;

  if (currentTurn == "gtoken") {
    btn.style.backgroundColor = "#049546";
  } else if (currentTurn == "rtoken") {
    btn.style.backgroundColor = "#ea1519";
  } else if (currentTurn == "btoken") {
    btn.style.backgroundColor = "#1095e4";
  } else if (currentTurn == "ytoken") {
    btn.style.backgroundColor = "#f4d000";
  }

  if (rNum1 == 5 && rNum2 == 5) {
    //nothing
  } else {
    turnLoop++;
  }
  if (turnLoop >= 4) {
    turnLoop = 0;
  }
}

//Validates the position if you move from the token first time out of the playerbox
function pvalidator() {
  //For Green
  if (currentTurn == "gtoken") {
    let j = 0;
    let t = 0;
    pCheck1 = nBox[j + rNum1 + 1];
    pCheck2 = nBox[j + rNum2 + 1];

    if (rNum1 == 5) {
      pCheck1 = nBox[0];
      ruler = false;
    }
    if (rNum2 == 5) {
      pCheck2 = nBox[0];
      ruler = false;
    }

    if (selectIt == pCheck1 && noA == false) {
      if (rNum1 == 5) {
        cMaster = "A";
        return true;
      } else {
        return false;
      }
    } else if (selectIt == pCheck2 && noB == false) {
      if (rNum2 == 5) {
        cMaster = "B";
        return true;
      } else {
        return false;
      }
    }
  }
  // For Red
  if (currentTurn == "rtoken") {
    let j = 13;
    pCheck1 = nBox[j + rNum1 + 1];
    pCheck2 = nBox[j + rNum2 + 1];

    if (rNum1 == 5) {
      pCheck1 = nBox[13];
      ruler = false;
    }
    if (rNum2 == 5) {
      pCheck2 = nBox[13];
      ruler = false;
    }

    if (selectIt == pCheck1 && noA == false) {
      if (rNum1 == 5) {
        cMaster = "A";
        return true;
      } else {
        return false;
      }
    } else if (selectIt == pCheck2 && noB == false) {
      if (rNum2 == 5) {
        cMaster = "B";
        return true;
      } else {
        return false;
      }
    }
  }
  // For Blue
  if (currentTurn == "btoken") {
    let j = 26;
    pCheck1 = nBox[j + rNum1 + 1];
    pCheck2 = nBox[j + rNum2 + 1];

    if (rNum1 == 5) {
      pCheck1 = nBox[26];
      ruler = false;
    }
    if (rNum2 == 5) {
      pCheck2 = nBox[26];
      ruler = false;
    }

    if (selectIt == pCheck1 && noA == false) {
      if (rNum1 == 5) {
        cMaster = "A";
        return true;
      } else {
        return false;
      }
    } else if (selectIt == pCheck2 && noB == false) {
      if (rNum2 == 5) {
        cMaster = "B";
        return true;
      } else {
        return false;
      }
    }
  }
  // For yellow
  if (currentTurn == "ytoken") {
    let j = 39;
    pCheck1 = nBox[j + rNum1 + 1];
    pCheck2 = nBox[j + rNum2 + 1];

    if (rNum1 == 5) {
      pCheck1 = nBox[39];
      ruler = false;
    }
    if (rNum2 == 5) {
      pCheck2 = nBox[39];
      ruler = false;
    }

    if (selectIt == pCheck1 && noA == false) {
      if (rNum1 == 5) {
        cMaster = "A";
        return true;
      } else {
        return false;
      }
    } else if (selectIt == pCheck2 && noB == false) {
      if (rNum2 == 5) {
        cMaster = "B";
        return true;
      } else {
        return false;
      }
    }
  }
}

function qValidator(a) {
  if (selectIt.className.includes("sBox")) {
    return false;
  }

  //For Green
  if (a.className.includes(cTstring, 0) && cTstring == "gtoken") {
    let k = tokenCarry.parentNode.className.match(/\d+/g).map(Number);
    var m = 0;
    pCheck1 = nBox[parseInt(rNum1 + k[0])];
    pCheck2 = nBox[parseInt(rNum2 + k[0])];
    if (tokenCarry.parentNode.className.includes("sBox")) {
      if (rNum1 == 5 && noA == false) {
        pCheck1 = nBox[0];
      }
      if (rNum2 == 5 && noB == false) {
        pCheck2 = nBox[0];
      }
    }

    if (tokenCarry.parentNode.className.includes("vip")) {
      pCheck1 = nBox[parseInt(52 + k[0] + rNum1)];
      pCheck2 = nBox[parseInt(52 + k[0] + rNum2)];
    } else {
      if (rNum1 + k[0] >= 51) {
        pCheck1 = nBox[parseInt(rNum1 + k[0] + 1)];
      }
      if (rNum2 + k[0] >= 51) {
        pCheck2 = nBox[parseInt(rNum2 + k[0] + 1)];
      }
    }

    if (selectIt == pCheck1 && noA == false) {
      if (
        !pCheck1.className.includes("R") &&
        !pCheck1.className.includes("nBoxB")
      ) {
        cMaster = "A";
        return true;
      } else if (pCheck1.className.includes("R1")) {
        //Checks whether it is winning or not
        cMaster = "A";
        tokenCarry.parentNode.classList.remove("tSelect");
        tokenCarry.parentNode.removeChild(tokenCarry);
        tokenCarry = "";
        selectIt = "";
        n = 0;
        noA = true;
        return false;
      }
    } else if (selectIt == pCheck2 && noB == false) {
      if (
        !pCheck2.className.includes("R") &&
        !pCheck2.className.includes("nBoxB")
      ) {
        cMaster = "B";
        return true;
      } else if (pCheck2.className.includes("R1")) {
        //checks whether it is winning or not
        cMaster = "B";
        tokenCarry.parentNode.classList.remove("tSelect");
        tokenCarry.parentNode.removeChild(tokenCarry);
        tokenCarry = "";
        selectIt = "";
        n = 0;
        noB = true;
        return false;
      }
    }
  }
  // For Red
  if (a.className.includes(cTstring, 0) && cTstring == "rtoken") {
    let k = tokenCarry.parentNode.className.match(/\d+/g).map(Number);
    var m = 0;
    pCheck1 = nBox[parseInt(rNum1 + k[0])];
    pCheck2 = nBox[parseInt(rNum2 + k[0])];

    if (tokenCarry.parentNode.className.includes("sBox")) {
      if (rNum1 == 5 && noA == false) {
        pCheck1 = nBox[13];
      }
      if (rNum2 == 5 && noB == false) {
        pCheck2 = nBox[13];
      }
    }

    if (tokenCarry.parentNode.className.includes("vip")) {
      pCheck1 = nBox[parseInt(57 + k[0] + rNum1)];
      pCheck2 = nBox[parseInt(57 + k[0] + rNum2)];
      if (mrSecond()) {
        return true;
      }
    } else if (k[0] <= 12) {
      if (rNum1 + k[0] >= 12 && rNum1 + k[0] <= 27) {
        pCheck1 = nBox[parseInt(rNum1 + 57 - Math.abs(12 - k[0]))];
      }
      if (rNum2 + k[0] >= 12 && rNum2 + k[0] <= 27) {
        pCheck2 = nBox[parseInt(rNum2 + 57 - Math.abs(12 - k[0]))];
      }
      if (mrSecond()) {
        return true;
      }
    } else if (mrLoop(m)) {
      //To check if it has reached nBox52 or not
      if (selectIt == pCheck1 && noA == false) {
        cMaster = "A";
        return true;
      } else if (selectIt == pCheck2 && noB == false) {
        cMaster = "B";
        return true;
      }
    } else {
      if (selectIt == pCheck1 && noA == false) {
        cMaster = "A";
        return true;
      } else if (selectIt == pCheck2 && noB == false) {
        cMaster = "B";
        return true;
      }
    }
    function mrSecond() {
      if (selectIt == pCheck1 && noA == false) {
        if (
          !pCheck1.className.includes("nBoxB") &&
          !pCheck1.className.includes("nBoxY")
        ) {
          cMaster = "A";
          return true;
        } else if (pCheck1.className.includes("B1")) {
          //Checks whether it is winning or not
          cMaster = "A";
          tokenCarry.parentNode.classList.remove("tSelect");
          tokenCarry.parentNode.removeChild(tokenCarry);
          tokenCarry = "";
          selectIt = "";
          n = 0;
          noA = true;
          return false;
        }
      } else if (selectIt == pCheck2 && noB == false) {
        if (
          !pCheck2.className.includes("nBoxB") &&
          !pCheck2.className.includes("nBoxY")
        ) {
          cMaster = "B";
          return true;
        } else if (pCheck2.className.includes("B1")) {
          //checks whether it is winning or not
          cMaster = "B";
          tokenCarry.parentNode.classList.remove("tSelect");
          tokenCarry.parentNode.removeChild(tokenCarry);
          tokenCarry = "";
          selectIt = "";
          n = 0;
          noB = true;
          return false;
        }
      }
    }
    //Start

    function mrLoop(m) {
      //Check if it has reached 52 or not
      for (let l = 0; l < vipB.length; l++) {
        if (pCheck1 == vipB[l] || pCheck2 == vipB[l]) {
          m = parseInt(52 - k[0]);
          if (pCheck1 == vipB[l]) {
            pCheck1 = nBox[Math.abs(parseInt(rNum1 - m))];
          }
          if (pCheck2 == vipB[l]) {
            pCheck2 = nBox[Math.abs(parseInt(rNum2 - m))];
          }
          return true;
        }
      }
      for (var v in vipB) {
        if (pCheck1 != v || pCheck2 != v) {
          return true;
        }
      }
    }
  }
  // For Blue
  if (a.className.includes(cTstring, 0) && cTstring == "btoken") {
    let k = tokenCarry.parentNode.className.match(/\d+/g).map(Number);
    var m = 0;
    pCheck1 = nBox[parseInt(rNum1 + k[0])];
    pCheck2 = nBox[parseInt(rNum2 + k[0])];

    if (tokenCarry.parentNode.className.includes("sBox")) {
      if (rNum1 == 5 && noA == false) {
        pCheck1 = nBox[26];
      }
      if (rNum2 == 5 && noB == false) {
        pCheck2 = nBox[26];
      }
    }

    if (tokenCarry.parentNode.className.includes("vip")) {
      pCheck1 = nBox[parseInt(62 + k[0] + rNum1)];
      pCheck2 = nBox[parseInt(62 + k[0] + rNum2)];
      if (mrSecond()) {
        return true;
      }
    } else if (k[0] <= 25) {
      if (rNum1 + k[0] >= 25 && rNum1 + k[0] <= 40) {
        pCheck1 = nBox[parseInt(rNum1 + 62 - Math.abs(25 - k[0]))];
      }
      if (rNum2 + k[0] >= 25 && rNum2 + k[0] <= 40) {
        pCheck2 = nBox[parseInt(rNum2 + 62 - Math.abs(25 - k[0]))];
      }
      if (mrSecond()) {
        return true;
      }
    } else if (mrLoop(m)) {
      //To check if it has reached nBox52 or not
      if (selectIt == pCheck1 && noA == false) {
        cMaster = "A";
        return true;
      } else if (selectIt == pCheck2 && noB == false) {
        cMaster = "B";
        return true;
      }
    } else {
      if (selectIt == pCheck1 && noA == false) {
        cMaster = "A";
        return true;
      } else if (selectIt == pCheck2 && noB == false) {
        cMaster = "B";
        return true;
      }
    }
    function mrSecond() {
      if (selectIt == pCheck1 && noA == false) {
        if (
          !pCheck1.className.includes("nBoxY") &&
          !pCheck1.className.includes("nBoxZ")
        ) {
          cMaster = "A";
          return true;
        } else if (pCheck1.className.includes("Y1")) {
          //Checks whether it is winning or not
          cMaster = "A";
          tokenCarry.parentNode.classList.remove("tSelect");
          tokenCarry.parentNode.removeChild(tokenCarry);
          tokenCarry = "";
          selectIt = "";
          n = 0;
          noA = true;
          return false;
        }
      } else if (selectIt == pCheck2 && noB == false) {
        if (
          !pCheck2.className.includes("nBoxY") &&
          !pCheck2.className.includes("nBoxZ")
        ) {
          cMaster = "B";
          return true;
        } else if (pCheck2.className.includes("Y1")) {
          //checks whether it is winning or not
          cMaster = "B";
          tokenCarry.parentNode.classList.remove("tSelect");
          tokenCarry.parentNode.removeChild(tokenCarry);
          tokenCarry = "";
          selectIt = "";
          n = 0;
          noB = true;
          return false;
        }
      }
    }
    //Start

    function mrLoop(m) {
      //Check if it has reached 52 or not
      for (let l = 0; l < vipB.length; l++) {
        if (pCheck1 == vipB[l] || pCheck2 == vipB[l]) {
          m = parseInt(52 - k[0]);
          if (pCheck1 == vipB[l]) {
            pCheck1 = nBox[Math.abs(parseInt(rNum1 - m))];
          }
          if (pCheck2 == vipB[l]) {
            pCheck2 = nBox[Math.abs(parseInt(rNum2 - m))];
          }
          return true;
        }
      }
      for (var v in vipB) {
        if (pCheck1 != v || pCheck2 != v) {
          return true;
        }
      }
    }
  }
  // For yellow
  if (a.className.includes(cTstring, 0) && cTstring == "ytoken") {
    let k = tokenCarry.parentNode.className.match(/\d+/g).map(Number);
    var m = 0;
    pCheck1 = nBox[parseInt(rNum1 + k[0])];
    pCheck2 = nBox[parseInt(rNum2 + k[0])];

    if (tokenCarry.parentNode.className.includes("sBox")) {
      if (rNum1 == 5 && noA == false) {
        pCheck1 = nBox[39];
      }
      if (rNum2 == 5 && noB == false) {
        pCheck2 = nBox[39];
      }
    }

    if (tokenCarry.parentNode.className.includes("vip")) {
      pCheck1 = nBox[parseInt(67 + k[0] + rNum1)];
      pCheck2 = nBox[parseInt(67 + k[0] + rNum2)];
      if (mrSecond()) {
        return true;
      }
    } else if (k[0] <= 38) {
      if (rNum1 + k[0] >= 38 && rNum1 + k[0] <= 40) {
        pCheck1 = nBox[parseInt(rNum1 + 67 - Math.abs(38 - k[0]))];
      }
      if (rNum2 + k[0] >= 38 && rNum2 + k[0] <= 40) {
        pCheck2 = nBox[parseInt(rNum2 + 67 - Math.abs(38 - k[0]))];
      }
      if (mrSecond()) {
        return true;
      }
    } else if (mrLoop(m)) {
      //To check if it has reached nBox52 or not
      if (selectIt == pCheck1 && noA == false) {
        cMaster = "A";
        return true;
      } else if (selectIt == pCheck2 && noB == false) {
        cMaster = "B";
        return true;
      }
    } else {
      if (selectIt == pCheck1 && noA == false) {
        cMaster = "A";
        return true;
      } else if (selectIt == pCheck2 && noB == false) {
        cMaster = "B";
        return true;
      }
    }
    function mrSecond() {
      if (selectIt == pCheck1 && noA == false) {
        if (
          !pCheck1.className.includes("nBoxY") &&
          !pCheck1.className.includes("nBoxZ")
        ) {
          cMaster = "A";
          return true;
        } else if (pCheck1.className.includes("Y1")) {
          //Checks whether it is winning or not
          cMaster = "A";
          tokenCarry.parentNode.classList.remove("tSelect");
          tokenCarry.parentNode.removeChild(tokenCarry);
          tokenCarry = "";
          selectIt = "";
          n = 0;
          noA = true;
          return false;
        }
      } else if (selectIt == pCheck2 && noB == false) {
        if (
          !pCheck2.className.includes("nBoxY") &&
          !pCheck2.className.includes("nBoxZ")
        ) {
          cMaster = "B";
          return true;
        } else if (pCheck2.className.includes("Y1")) {
          //checks whether it is winning or not
          cMaster = "B";
          tokenCarry.parentNode.classList.remove("tSelect");
          tokenCarry.parentNode.removeChild(tokenCarry);
          tokenCarry = "";
          selectIt = "";
          n = 0;
          noB = true;
          return false;
        }
      }
    }
    //Start

    function mrLoop(m) {
      //Check if it has reached 52 or not
      for (let l = 0; l < vipB.length; l++) {
        if (pCheck1 == vipB[l] || pCheck2 == vipB[l]) {
          m = parseInt(52 - k[0]);
          if (pCheck1 == vipB[l]) {
            pCheck1 = nBox[Math.abs(parseInt(rNum1 - m))];
          }
          if (pCheck2 == vipB[l]) {
            pCheck2 = nBox[Math.abs(parseInt(rNum2 - m))];
          }
          return true;
        }
      }
      for (var v in vipB) {
        if (pCheck1 != v || pCheck2 != v) {
          return true;
        }
      }
    }
  }
}

function tWin() {
  //Virtually clicks the nBoxR1 box
  if (tokenCarry.className.includes("gtoken")) {
    nBox[57].click();
  }
  //Virtually clicks the nBoxB1 box
  if (tokenCarry.className.includes("rtoken")) {
    nBox[62].click();
  }
  //Virtually clicks the nBoxY1 box
  if (tokenCarry.className.includes("btoken")) {
    nBox[67].click();
  }
  //Virtually clicks the nBoxG1 box
  if (tokenCarry.className.includes("ytoken")) {
    nBox[72].click();
  }
}
