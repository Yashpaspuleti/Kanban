// show/hide modal on + click

const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector(".remove-btn");
const modalCont = document.querySelector(".modal-cont");
const textAreaCont = document.querySelector(".textArea-cont");

let addTaskFlag = false; //default value, popup should not be visible

let removeTaskFlag = false;

const ticketArr = JSON.parse(localStorage.getItem("ticket")) || [];

addBtn.addEventListener("click", () => {
  addTaskFlag = !addTaskFlag; //toggle variable value.

  if (addTaskFlag) {
    modalCont.style.display = "flex";
  } else {
    modalCont.style.display = "none";
  }
});

//remove tickets
removeBtn.addEventListener("click", () => {
  removeTaskFlag = !removeTaskFlag;

  const allTickets = document.querySelectorAll(".ticket-cont");
  console.log(allTickets, "allTickets");

  for (let i = 0; i < allTickets.length; i++) {
    handleTicketRemoval(allTickets[i]);
  }

  if (removeTaskFlag) {
    alert("Delete button has been activated");
    removeBtn.style.color = "red";
  } else {
    removeBtn.style.color = "white";
  }
});

function handleTicketRemoval(ticketElem) {
  const id = ticketElem.querySelector(".ticket-id").innerText;

  console.log(ticketElem);

  ticketElem.addEventListener("click", () => {
    if (removeTaskFlag === true) {
      ticketElem.remove();
      const ticketIdx = getTicketIdx(id);
      ticketArr.splice(ticketIdx, 1);
      updateLocalStorage();
    } else {
      console.log("in else statement");
    }
  });
}

// create a ticket dynamically
function createTicket(ticketColor, ticketTask, ticketID) {
  //new ticket
  const ticketCont = document.createElement("div");
  ticketCont.classList.add("ticket-cont");
  ticketCont.innerHTML = `
        <div class="ticket-color" style="background-color: ${ticketColor}"></div>
        <div class="ticket-id">${ticketID}</div>
        <div class="ticket-area">${ticketTask}</div>
        <div class="ticket-lock">
          <i class="fa-solid fa-lock"></i>
          <!-- <i class="fa-solid fa-lock-open"></i> -->
        </div>
      `;

  const mainCont = document.querySelector(".main-cont");
  mainCont.appendChild(ticketCont);

  //Add removal functionality to the newly created ticket
  handleLock(ticketCont);
  handleColor(ticketCont);
}

let modalPriorityColor = "lightpink";

modalCont.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (e.key === "Shift") {
    const ticketTaskValue = textAreaCont.value;

    //Generate random ID
    const ticketID = Math.random().toString(36).substring(2, 9);

    createTicket(modalPriorityColor, ticketTaskValue, ticketID); //pass my color
    modalCont.style.display = "none"; //hides the modal
    textAreaCont.value = ""; // clear's contents of textArea on close

    ticketArr.push({
      ticketID: ticketID,
      ticketColor: modalPriorityColor,
      taskContent: ticketTaskValue,
    });

    updateLocalStorage();
  }
});

//selecting priority color

const allPriorityColors = document.querySelectorAll(".priority-color");

allPriorityColors.forEach((colorElem) => {
  colorElem.addEventListener("click", () => {
    //on each color, remove active class.
    allPriorityColors.forEach((priorityColorElem) => {
      priorityColorElem.classList.remove("active");
    });
    //on click element, add the class
    colorElem.classList.add("active");
    modalPriorityColor = colorElem.getAttribute("data-color");
  });
});

// lock functionality

const lockCloseClass = "fa-lock";
const lockOpenClass = "fa-lock-open";

function handleLock(ticketElem) {
  const ticketLockElem = document.querySelector(".ticket-lock");
  const ticketTaskArea = ticketElem.querySelector(".ticket-area");

  const id = ticketElem.querySelector(".ticket-id").innerText;

  ticketLockElem.addEventListener("click", () => {
    const ticketIdx = getTicketIdx(id);

    if (ticketLockElem.children[0].classList.contains(lockCloseClass)) {
      ticketLockElem.children[0].classList.remove(lockCloseClass);
      ticketLockElem.children[0].classList.add(lockOpenClass);

      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLockElem.children[0].classList.remove(lockOpenClass);
      ticketLockElem.children[0].classList.add(lockCloseClass);
      ticketTaskArea.setAttribute("contenteditable", "false");
    }

    ticketArr[ticketIdx].taskContent = ticketTaskArea.innerText;
    updateLocalStorage();
  });
}

const colors = ["lightsalmon", "lightgreen", "lightpink", "lightblue"];

function handleColor(ticketElem) {
  const ticketColorBand = ticketElem.querySelector(".ticket-color");
  const id = ticketElem.querySelector(".ticket-id").innerText;

  ticketColorBand.addEventListener("click", () => {
    const currentColor = ticketColorBand.style.backgroundColor;

    const ticketIdx = getTicketIdx(id);

    const currentColorIndex = colors.findIndex(function (color) {
      return color === currentColor;
    });

    console.log(colors, currentColor, currentColorIndex);

    const newColorIndex = (currentColorIndex + 1) % colors.length;
    const newTicketColor = colors[newColorIndex];

    ticketColorBand.style.backgroundColor = newTicketColor;

    ticketArr[ticketIdx].ticketColor = newTicketColor;
    updateLocalStorage();
  });
}

const toolBoxColors = document.querySelectorAll(".color");

toolBoxColors.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    const selectedColor = colorElem.classList[0];
    const allTickets = document.querySelectorAll(".ticket-cont");

    allTickets.forEach(function (ticketElem) {
      const ticketColorBand = ticketElem.querySelector(".ticket-color");
      const currentColor = ticketColorBand.style.backgroundColor;

      if (currentColor === selectedColor) {
        ticketElem.style.display = "block";
      } else {
        ticketElem.style.display = "none";
      }
    });
  });

  colorElem.addEventListener("dblclick", function () {
    const allTickets = document.querySelectorAll(".ticket-cont");
    allTickets.forEach(function (ticketElem) {
      ticketElem.style.display = "block";
    });
  });
});

function updateLocalStorage() {
  // simply to update LS.
  localStorage.setItem("tickets", JSON.stringify(ticketArr));
}

function initialise() {
  // first step is to retrieve all tickets stored in LS.
  if (localStorage.getItem("tickets")) {
    for (let i = 0; i < ticketArr.length; i++) {
      createTicket(
        ticketArr[i].ticketColor,
        ticketArr[i].taskContent,
        ticketArr[i].ticketID
      );
    }
  }
}

initialise();

function getTicketIdx(id) {
  // find the ticket obj index from my LS.
  // that is the ticket that needs to be updated.

  let ticketIdx = ticketArr.findIndex(function (ticketObj) {
    return ticketObj.ticketID === id;
  });

  return ticketIdx;
}
