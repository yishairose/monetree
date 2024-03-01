const global = {
  loggedIn: false,
  currentUser: undefined,
  currentUserBallance: undefined,
  movementsSorted: false,
};

//Select DOM Elements
const loginForm = document.querySelector(".login-form");
const loginBtn = document.querySelector(".login-btn");
const appBody = document.querySelector(".app__container ");
const asOfdate = document.querySelector(".current-ballance-heading span");
const currentBallance = document.querySelector(".current-balance");
const cardMoneyIn = document.querySelector(".card--money-in h2");
const cardMoneyOut = document.querySelector(".card--money-out h2");
const cardInterest = document.querySelector(".card--interest h2");
const sort = document.querySelector(".filter-icons-sort");
const transactionContainer = document.querySelector(".transaction-container");
const transferForm = document.querySelector(".form--transfer");
const transferTo = document.getElementById("transfer-to");
const transferAmount = document.getElementById("amount");
const loanForm = document.querySelector(".form--loan");
const loanAmount = document.querySelector("#request-loan");
const closeForm = document.querySelector(".form--close");
const closeFormConfirmUser = document.querySelector("#confirm-user");
const closeFormConfirmPin = document.querySelector("#confirm-pin");
const logoutTimer = document.querySelector(".app__navigation-logout-timer");
const profileName = document.querySelector(".user-name");
const profileImg = document.querySelector(".user-image-container img");
const logoutBtn = document.querySelector(".user-icons__logout");

////////////////////////////////////////////////////
//Data//
const account1 = {
  owner: "Yishai Rose",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-08-27T17:01:17.194Z",
    "2023-12-18T23:36:17.929Z",
    "2023-12-20T10:51:36.790Z",
  ],
  currency: "GBP",
  locale: "gb-GB", // de-DE
  gender: "male",
  image: `https://randomuser.me/api/portraits/men/${
    Math.floor(Math.random() * 100) + 1
  }.jpg`,
};

const account2 = {
  owner: "Bracha Rose",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "en-US",
  gender: "female",
  image: `https://randomuser.me/api/portraits/women/${
    Math.floor(Math.random() * 100) + 1
  }.jpg`,
};

const account3 = {
  owner: "John Smith",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
  gender: "male",
  image: `https://randomuser.me/api/portraits/men/${
    Math.floor(Math.random() * 100) + 1
  }.jpg`,
};

const account4 = {
  owner: "Thomas Butler Wells",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
  gender: "male",
  image: `https://randomuser.me/api/portraits/men/${
    Math.floor(Math.random() * 100) + 1
  }.jpg`,
};

const users = [account1, account2, account3, account4];

function loginAuth(users, username, pin) {
  const currentUser = users.find((user) => {
    return user.username === username;
  });

  if (currentUser?.pin === pin) {
    global.currentUser = currentUser;
    login();
  } else {
    console.error("Invalid Login");
  }
}

function computeUsername(accs) {
  accs.forEach(
    (account) =>
      (account.username = account.owner
        .toLowerCase()
        .split(" ")
        .map((i) => i[0])
        .join(""))
  );
}

computeUsername(users);
function updateUI(user) {
  //Display Latest transactions
  populateTransactions(user);
  //Update and display total ballance
  updateBallance(user.movements);
  //Print total money in
  displayMovementSummary(user);
}
function startLogoutTimer() {
  logoutTimer.textContent = `You will be logged out in 10:00`;
  let time = 600000;
  const timer = setInterval(() => {
    time -= 1000;
    const timeLeft = new Intl.DateTimeFormat("gb-GB", {
      minute: "numeric",
      second: "numeric",
    }).format(time);

    logoutTimer.textContent = `You will be logged out in ${timeLeft}`;
    if (time === 0) clearInterval(timer);
  }, 1000);

  setTimeout(logout, 600000);

  global.timer = timer;
}

function login() {
  startLogoutTimer();
  appBody.classList.toggle("show");
  appBody.classList.toggle("hide");
  loginForm.classList.toggle("hide");
  loginForm.classList.toggle("show");
  loginForm.reset();
  //Display Latest transactions
  populateTransactions(global.currentUser);
  //Update and display total ballance
  updateBallance(global.currentUser.movements);
  //Print total money in
  displayMovementSummary(global.currentUser);
  //Display Account Owner name
  profileName.innerText = global.currentUser.owner;
  profileImg.src = global.currentUser.image;
}
function logout() {
  appBody.classList.toggle("hide");
  appBody.classList.toggle("show");
  loginForm.classList.toggle("show");
  loginForm.classList.toggle("hide");
  clearInterval(global.timer);
}

updateBallance = function (transactions) {
  currentBallance.innerText = "";
  const ballance = transactions.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  currentBallance.innerText = `${formatCurrency(
    ballance,
    global.currentUser.locale,
    global.currentUser.currency
  )}`;
  global.currentUserBallance = ballance;

  const date = new Date();
  asOfdate.innerText = `As of ${`${date.getDate()}`.padStart(2, 0)}/${`${
    date.getMonth() + 1
  }`.padStart(2, 0)}/${date.getFullYear()} at ${`${date.getHours()}`.padStart(
    2,
    0
  )}:${`${date.getMinutes()}`.padStart(2, 0)}`;
};

function formatDates(date) {
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs((date1 - date2) / 1000 / 60 / 60 / 24));
  };
  const now = new Date();
  const daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const locale = navigator.language;
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const movementDate = new Intl.DateTimeFormat(locale, options).format(date);
  return movementDate;
}

function formatCurrency(amount, locale, currency) {
  const options = {
    style: "currency",
    currency: currency,
  };
  return Intl.NumberFormat(locale, options).format(amount);
}
function populateTransactions(user, sort = false) {
  transactionContainer.innerHTML = "";
  const trans = sort
    ? user.movements.slice().sort((a, b) => a - b)
    : user.movements;

  trans.forEach((transaction, i) => {
    const movementDate = new Date(user.movementsDates[i]);
    const html = `<div class="transaction-item">
    <div class="transaction-type">
      <span class="${transaction > 0 ? "deposit" : "withdrawal"}-tag">${
      i + 1
    }.${transaction > 0 ? "Deposit" : "Withdrawal"}</span>
    </div>
    <div class="transaction-date">${formatDates(movementDate)}</div>
  
    <div class="amount">${formatCurrency(
      transaction,
      global.currentUser.locale,
      global.currentUser.currency
    )}</div>
  </div>`;
    transactionContainer.insertAdjacentHTML("afterbegin", html);
  });
  sort ? (global.movementsSorted = true) : (global.movementsSorted = false);
}

function displayMovementSummary(account) {
  cardMoneyIn.innerText = "";
  cardMoneyOut.innerText = "";
  cardInterest.innerText = "";
  const income = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr);
  cardMoneyIn.innerText = `${formatCurrency(
    income,
    global.currentUser.locale,
    global.currentUser.currency
  )}`;
  const outgoing = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  cardMoneyOut.innerText = `${formatCurrency(
    outgoing,
    global.currentUser.locale,
    global.currentUser.currency
  )}`;
  const interestRate = account.interestRate / 100;
  const interest = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => {
      if (curr * interestRate > 1) {
        return acc + curr * interestRate;
      } else {
        return acc;
      }
    }, 0);
  cardInterest.innerText = `${formatCurrency(
    interest,
    global.currentUser.locale,
    global.currentUser.currency
  )}`;
}

function transfer(to, amount) {
  const toAccount = users.find((acc) => {
    return acc.username === to;
  });

  if (toAccount && amount > 0 && amount <= global.currentUserBallance) {
    global.currentUser.movements.push(-amount);
    toAccount?.movements.push(amount);
    const date = new Date();
    global.currentUser.movementsDates.push(date.toISOString());
    toAccount.movementsDates.push(date.toISOString());
    updateUI(global.currentUser);
  } else {
    console.log("Not enough Funds to complete transfer");
  }

  transferForm.reset();
}

transferForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearInterval(global.timer);
  startLogoutTimer();
  const to = transferTo.value;
  const amount = +transferAmount.value;
  transfer(to, amount);
});

function requestLoan(amount) {
  const date = new Date();
  global.currentUser.movementsDates.push(date.toISOString());
  global.currentUser.movements.push(+amount);
  updateUI(global.currentUser);
}

function closeAccount(username, pin) {
  const accountIndex = users.findIndex((user) => user.username === username);
  if (
    accountIndex &&
    users[accountIndex] === global.currentUser &&
    users[accountIndex].pin === pin
  ) {
    users.splice(accountIndex, 1);
    logout();
  } else {
    console.log("Incorrect User Details");
  }
}
loanForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearInterval(global.timer);
  startLogoutTimer();
  const amount = +loanAmount.value;
  setTimeout(() => {
    requestLoan(amount);
  }, 3000);

  e.target.reset();
});
closeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearInterval(global.timer);
  startLogoutTimer();
  const username = closeFormConfirmUser.value;
  const pin = +closeFormConfirmPin.value;
  closeAccount(username, pin);
  e.target.reset();
});
//Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const pin = +document.getElementById("password").value;
  loginAuth(users, username, pin);
});
//Logount
logoutBtn.addEventListener("click", logout);

sort.addEventListener("click", (e) => {
  e.preventDefault();
  global.movementsSorted
    ? populateTransactions(global.currentUser)
    : populateTransactions(global.currentUser, sort);
});
