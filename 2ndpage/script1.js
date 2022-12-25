'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale
// new account object
class NewAccount{
  constructor(name, pin){
    this.owner = name;
    this.movements = [100];
    this.interestRate = 1.2;
    this.pin = pin;
    this.movementsDates = [new Date().toISOString()];
    this.currency = 'INR';
    this.locale = window.navigator.language;
    this.username = this.owner.toLowerCase().split(' ').map((name) => name[0]).join(''); 
  }
};
const account1 = {
  owner: 'Agam Gupta',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2022-09-07T12:36:17.929Z',
    '2022-09-09T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Nidhi Nishad',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2021-12-25T06:04:23.907Z',
    '2021-11-30T09:48:16.867Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2022-07-06T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
///////////////////////////////////////////////
// Account opening functionality

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDates = function (date, locale) {
  const daysPassed = Math.round(Math.abs(date - new Date()) / (1000 * 60 * 60 * 24));
  if (daysPassed == 0) return 'Today';
  if (daysPassed == 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // console.log(date);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }
  return Intl.DateTimeFormat(locale, options).format(date);
};

//////////////////
// Numberformatter
const numberFormatter = function (val, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,

  }).format(Math.abs(val))
};

const cmpfun = function(a, b){
  if(a[0] == b[0])
    return 0;
  return a[0] - b[0];
}
const mySort = function(movs){
  movs.sort(cmpfun);
  return movs;
}

const displayMovement = function (acc, isSorted = false) {
  // first remove old html inside movements class
  containerMovements.innerHTML = '';
  const newmovs = acc.movements.map((mov, i)=>[mov, i]);
  // console.log(mySort(newmovs));
  const movs = isSorted ? mySort(newmovs) : newmovs;
  const movementDates = acc.movementsDates;
  movs.forEach((move, i) => {

    const date = new Date(movementDates[move[1]]);
    const displayDate = formatMovementDates(date, acc.locale);

    const type = move[0] > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>

          <div class="movements__value">${numberFormatter(move[0], acc.locale, acc.currency)}</div>
        </div>`;

    // insert in containerMovements div above html
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, val) => acc + val, 0);
  labelBalance.innerHTML = `${numberFormatter(acc.balance, acc.locale, acc.currency)}`;
}
// displayBalance(account1.movements);

const calDisplaySummary = function (acc) {
  const movement = acc.movements;
  const rate = acc.interestRate;
  const summaryin = movement.filter((val) => val > 0).reduce((acc, val) => acc + val, 0);
  labelSumIn.innerHTML = `Rs.${summaryin.toFixed(2)}`;
  labelSumIn.innerHTML = numberFormatter(summaryin.toFixed(2), acc.locale, acc.currency);
  const summaryout = movement.filter(val => val < 0).reduce((sum, val) => sum + val, 0);
  labelSumOut.innerHTML = numberFormatter(Math.abs(summaryout).toFixed(2), acc.locale, acc.currency);;

  const summaryint = movement.filter(val => val > 0).reduce((acc, curr) => acc + (curr * rate) / 100, 0);
  labelSumInterest.innerHTML = numberFormatter(summaryint.toFixed(2), acc.locale, acc.currency);
}

const updateUI = function (acc) {
  displayBalance(acc);
  calDisplaySummary(acc);
  displayMovement(acc);
  // console.log(acc);  
  containerApp.style.opacity = 1;
  labelWelcome.innerHTML = `Welcome back! ${acc.owner.split(' ')[0]}`;
  // DATE section
  // const now = new Date();
  // const day = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hours = `${now.getHours()}`.padStart(2, 0);;
  // const min = now.getMinutes();
  // labelDate.innerHTML = `${day}/${month}/${year}, ${hours}:${min}`;
  const now = new Date();
  const options = {
    month: 'long',
    day: 'numeric',
    year: '2-digit',
    weekday: 'long',
    // hour: 'numeric',
    // minute: 'numeric',
  };
  labelDate.innerHTML = Intl.DateTimeFormat(acc.locale, options).format(now);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {

    acc.username = acc.owner.toLocaleLowerCase().split(' ').map((name) => name[0]).join('');
  })
}
// updateUI(account1);
createUsernames(accounts);
// console.log(accounts);



const loginTimer = function () {
  // timer for 5 minutes
  let time = 120; // seconds


  const helper = () => {
    // console.log(time);
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.innerHTML = `${min}:${sec}`;
    // when 0 stop the timer and log out
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.innerHTML = `Log in to get started!`;
    }


    time--;
  }
  helper();
  const timer = setInterval(helper, 1000);  // setinterval() initially excutes callback after specified time, so to get rid of this we call it once seprately
  return timer;
};
////////////////// 
// login Event Handler
let currentAccount, timer;

// FAKE login
// currentAccount = account1;
// updateUI(currentAccount);


// const locale = navigator.language;
// console.log(locale);
// Date experiment


btnLogin.addEventListener('click', (e) => {
  // default behaviour of form it  gets automatically submitted and page is reloaded;
  e.preventDefault();
  currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === +inputLoginPin.value) {
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    // display UI and welcome  message
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = loginTimer();
  }
});

////////////
// Transfer operation
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;

  const recAccount = accounts.find((acc) => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (amount > 0 && recAccount && currentAccount.balance >= amount && recAccount.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    recAccount.movements.push(amount);
    // Transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recAccount.movementsDates.push(new Date().toISOString());
    // console.log('valid transfer');
    updateUI(currentAccount);

    // Resetting the timer
    clearInterval(timer);
    timer = loginTimer();
  }
});
// Loan functionality
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const loanAmount = Math.round(+inputLoanAmount.value);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  if (currentAccount.movements.some((mov) => mov > (loanAmount * 0.1))) {
    // loan approval delay

    setTimeout(() => {
      currentAccount.movements.push(loanAmount);
      // Loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      // Resetting the timer
      clearInterval(timer);
      timer = loginTimer();
    }, 1500);
  }
});

/////////////////////////////
// close  account
btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin) {
    console.log('delete');
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';

});

// sort button functionality
let isSorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovement(currentAccount, !isSorted);
  isSorted = !isSorted;
})

////////////////////////////////////////////
// open account functionality
// show modal
const openModal = document.querySelector('.btn--show-modal');
const modal = document.querySelector('.modal'), overlay = document.querySelector('.overlay');
openModal.addEventListener('click', function(e){
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
})
// close modal
const close = function(){
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}
const closemodal = document.querySelector('.btn--close-modal');
closemodal.addEventListener('click', close);
overlay.addEventListener('click', close);

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape' && !modal.classList.contains('hidden'))
    close();
})

const openAccount = document.querySelector('.account-open');
openAccount.addEventListener('click', function(e){
  e.preventDefault();
  const name = document.querySelector('.fname').value;
  const pin = +document.querySelector('.pin').value;
  // console.log(name, pin);
  const account3 = new NewAccount(name, pin);
  accounts.push(account3);
  close();
  currentAccount = account3;
  // display UI and welcome  message
  updateUI(currentAccount);
  if (timer) clearInterval(timer);
  timer = loginTimer();
})
/////////////////////////////////////////////////