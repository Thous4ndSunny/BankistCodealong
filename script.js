'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

//creating DOM elements
// better to pass data to function than having it in global variable
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; //sorting moves
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
  </div>`;
    //first argument is the position of insert second argument is the string
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// adding usernames to all the accounrs, using map to create initials and then using it on each of the accounts in the accounts array
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (account) {
  const depositSum = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const withdrawSum = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${depositSum}€`;
  labelSumOut.textContent = `${Math.abs(withdrawSum)}€`;
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (account.interestRate / 100))
    .filter(mov => mov > 1) //filters the value that is less 1 (interest)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUi = function (acc) {
  displayMovements(currentAccount.movements);

  // display balance
  calcPrintBalance(currentAccount);

  // display summary
  calcDisplaySummary(currentAccount);
};

// Event handlers
// default bahaviour in forms is that after you submint the page refreshes
let currentAccount;
createUsernames(accounts);
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevents the form from submiting
  // console.log('Login');
  // also in form html elements(input fields) when enter is pressed the button is automatically pressed (click event is triggerd)!
  currentAccount = accounts.find(
    //find method will return undefined if no element meets the set condition solved by optional chainig
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0] // spliting the name into array and taking the first element
    }`;
    containerApp.style.opacity = 100; //grabing the .app class and changing the opacity from 0 to 100 to show the UI

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // inputLoginPin.placeholder = 'dsadasda'; //placeholder manipulation
    inputLoginPin.blur(); //makes the pin input field loose focus
    // display movements
    updateUi(currentAccount); // update UI
  }
});
let transferAcc;
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const transferToAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    transferToAccount &&
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    transferToAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmount);
    transferToAccount.movements.push(transferAmount);
    updateUi(currentAccount);
  }

  // currentAccount.movements.push(-1 * transferAmount);
  // inputTransferAmount.blur();
  // displayMovements(currentAccount.movements);
  // inputTransferAmount.value = inputTransferTo.value = '';
  // // display balance
  // calcPrintBalance(currentAccount.movements);
  // // display summary
  // calcDisplaySummary(currentAccount);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    inputCloseUsername.value = inputClosePin.value = '';
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});
// state variable taht s monitoring movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//
// displayMovements(account1.movements);
// // createUsernames(accounts);
// console.log(accounts);
// calcPrintBalance(account1.movements);
// calcDisplaySummary(account1.movements);
// const username = user
//   .toLocaleLowerCase()
//   .split(' ')
//   .map(user => user[0])
//   .join('');
// console.log(username);
// console.log(containerMovements.innerHTML);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
// // Slice method => extracting the array without changing the original array => DOES NTO MUTATE THE ORIGINAL array!
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(1, -2));

// console.log(arr.slice(-1)); // last element of the array
// console.log(arr.slice()); // shallow copy of the array smilar to spread operatoro [...arr]
// // Splice method => it works almost the same as slice but it mutates the
// // original array in a way that takes the sliced elemnts from the original array
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2); // second parameter represents the number of elemnts that we want to delete
// console.log(arr);
// //for more about the methods use MDN documentation
// //Reverse method => reverses the arry in a way that it acctualy
// //mutates the orignial array
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// //CONCAT method => used to concatanate(links thogether) two arrays
// //does not mutate the original array
// const letters = arr.concat(arr2); //first is the array that uses the method
// console.log(letters);
// // JOIN method => joins the items in an array with the seperator
// // we specified and returns the as the string

// console.log(letters.join(' - '));

// // LOOPING OVER THE ARRAY USING THE FOR EACH METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // old for of loot
// for (const movement of movements) {
//   console.log(`${movements.indexOf(movement)}: Iteration`);
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }
// // FOR each method => higher order that requires the callback fucntion
// // at each iteration it executes the callback
// console.log('----------FOR EACH -----------');

// movements.forEach(function (movement) {
//   // console.log(`${movements.indexOf(movement)}: Iteration`);
//   // console.log(`${movements.indexOF(movement)}`);
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// });

// //More stuff about the for each

// //counter
// console.log('---------------COUNTER------------');
// //for old for of way we use array.entries
// // for (const [i, movement] of movements.entries()) {
// //   console.log(`${i}: iteration`);
// //   if (movement > 0) {
// //     console.log(`You deposited ${movement}`);
// //   } else {
// //     console.log(`You withdrew ${Math.abs(movement)}`);
// //   }
// // }

// // for each passes in the (curentElement,currentIndex,wholeArray)
// movements.forEach(function (movement, index, array) {
//   if (movement > 0) {
//     console.log(`Movement: ${index} You deposited ${movement}`);
//   } else {
//     console.log(`Movement: ${index} You withdrew ${Math.abs(movement)}`);
//   }
// });

// // when use for eaach and when for of
// // forEach can't be broken and it will always loop over the entire array
// // if break is needed it is better to use for of

// // FOR EACH METHOD ON MAPS AND SETS
// console.log('----------FOR EACH METHOD ON MAPS AND SETS---------');
// // 1. MAPS
// console.log('-----------------MAPS----------');

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// // value = first parameter,  key = index of that value, map = entire map
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// console.log('-----------------SETS----------');

// const currenciesUnique = new Set(['USD', 'GBP', 'US', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// // sets don't have keys just values so value = key & key =  value
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${value}: ${key}`);
// });
// // in JavaScrip "_" means throwaway variable

// DATA TRANSFORMATIONS
// Map filter and reduce

//Map is similar to the for each method but it maps the values of the original
// array to the new array

//filter is used to filter elements in the array that satisfy a certain condition

//reduce is used for reducing all the elements to the single value "accumulator method" is used

// console.log('-----------THE MAP METHOD-------------');
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;
// const movementUSD = movements.map(value => value * eurToUsd);
// console.log(movements);
// console.log(movementUSD);

// const movementsDescriptions = movements.map(
//   (move, i) =>
//     `Movement: ${i + 1} You ${move > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       move
//     )}`
// );
// console.log(movementsDescriptions);
// console.log('----------------- THE FILTER METHOD---------------------');
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// //creating the array of deposits
// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposit);

// //creating the array of withdrawals

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(`This are withdravals: ${withdrawals}`);

// // the reduce method
// console.log('------------THE REDUCE METHOD-------------');
// // computing the balance
// // accCUR is a acumulator whitch means it is the the variable that accumulates
// const balance = movements.reduce(function (accCurr, cur, i, arr) {
//   console.log(`iteration number ${i}: ${accCurr}`);
//   return accCurr + cur;
// }, 0); //this is the starting value of the accumulator (first iteration)
// console.log(account1.movements);

// // Maximum value of the movements

// const newMovements = account1.movements;
// console.log(newMovements);

// const maxMovement = newMovements.reduce((acc, value) => {
//   if (acc > value) return acc;
//   else return value;
// }, newMovements[0]);

// console.log(maxMovement);

// // Chaining the methods
// //PIPELINE that filters to only deposits that it converts them to USD than it summs them thogether
// const eurToUsd = 1.1;
// const depositConversionUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     console.log(arr);
//     return mov * eurToUsd;
//   })
//   // .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(depositConversionUSD);

// FIND METHOD  to get an element of an array based on a condition
// accepts a callback function
// similat to filter
//the difference is that filter method returns a new array and find returns the new element
// that means that find searches for the first element that will satisfy the given condition
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const findFirstNegative = movements.find(mov => mov < 0);
// console.log(findFirstNegative);

// console.log(accounts);

// // going thourght the array of objects and finding a specific object based on the unique property of that object

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// let newAccon = 0;
// for (const accon of accounts) {
//   if (accon.owner === 'Sarah Smith') {
//     newAccon = accon;
//   }
// }
// console.log(newAccon);

// Find idex method
// almost the same as find
// returning the index
//  equality
console.log(movements.includes(-130));
console.log(movements);

// condition
const anydeposits = movements.some(mov => mov > 500);
console.log(anydeposits);

// every method
// only retrurns ture if every element passes the given condition

console.log(movements.every(mov => mov > 0));

console.log(`${account4.movements.every(mov => mov > 0)}
} zanimljivo `);

// separate callback

const isdeposit = mov => mov > 0;

console.log(movements.every(isdeposit));

// flat an flatMap

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

console.log(arr.flat()); // we get a full array from the nested array

//only goes one level deeep default = 1
const arrDeep = [[[1, 2, [3, 4]], 2, 3], [4, 5, 6], 7, 8];
console.log(arrDeep.flat(2)); // but we can go 2x deep

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);

console.log(accountMovements.flat());
const allMovements = accountMovements.flat();
const overalbalance = allMovements.reduce((accu, move) => accu + move, 0);
console.log(overalbalance);

//  can be also done by chaining

// FLATMAP combines the flat and map

// SORTING
// strings
const owners = ['Jonas', 'Zac', 'Adam', 'Martha'];
console.log(owners.sort()); //mutates the array
// numbers
console.log(movements);
// console.log(movements.sort());
// does sorting based on strings
// converts everything in strings and then it sorts them
// alphabetically
// to pass compare callback
// a = current value b = next value
// if return less than 0 then a begore b , otherwise if greater than 0 the b before a
const ascendigOrder = movements.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
});

console.log(ascendigOrder);

// programatically creating and filling arrays

const x = new Array(7); // creates new empty argument with that length
x.fill(1, 3);
console.log(x);

// array.from fucntion

const fromARR = Array.from({ length: 7 }, () => 1);
console.log(fromARR);

const z = Array.from({ length: 7 }, (_, i) => i + 1); //similar as a map function on the empty array _ =thorwaway variable
console.log(z);

// array with one hundred random dice rolls

const diceRolls = Array.from(
  { length: 100 },
  () => Math.round(Math.random() * 5) + 1
);

console.log(diceRolls);
// bolesna spika
labelBalance.addEventListener('click', function () {
  const imbaUi = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(imbaUi);

  // console.log(imbaUi.map(el => Number(el.textContent.replace('€', ''))));
});
