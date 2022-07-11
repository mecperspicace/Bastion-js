#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import { createSpinner } from "nanospinner";
import gradient from 'gradient-string';

const banner = `
▀█████████▄     ▄████████    ▄████████     ███      ▄█   ▄██████▄  ███▄▄▄▄   
  ███    ███   ███    ███   ███    ███ ▀█████████▄ ███  ███    ███ ███▀▀▀██▄ 
  ███    ███   ███    ███   ███    █▀     ▀███▀▀██ ███▌ ███    ███ ███   ███ 
 ▄███▄▄▄██▀    ███    ███   ███            ███   ▀ ███▌ ███    ███ ███   ███ 
▀▀███▀▀▀██▄  ▀███████████ ▀███████████     ███     ███▌ ███    ███ ███   ███ 
  ███    ██▄   ███    ███          ███     ███     ███  ███    ███ ███   ███ 
  ███    ███   ███    ███    ▄█    ███     ███     ███  ███    ███ ███   ███ 
▄█████████▀    ███    █▀   ▄████████▀     ▄████▀   █▀    ▀██████▀   ▀█   █▀  
                                                                             `;

function welcome() {
  console.clear();
  console.log(customgradient(banner));
  console.log(customgradient(
    "                                                     by MecPerspicace | v1.0"
  ));
  console.log(customgradient(
    "For $EGLD donation : erd19jcvvj7v7re6pnmypjds2yvlzrwdvp0l8lxr5qn2mdlns7jt8xrqtccly5\n"
  ));
}

let customgradient = gradient('yellow', 'green');
let upper = false;
let lower = false;
let numbers = false;
let symbols = false;
let amount = 0;
let lenght = 10;

async function upper_choice() {
  const answers = await inquirer.prompt({
    name: "uppercase",
    type: "list",
    message: customgradient("Do you want uppercase letters"),
    choices: ["Yes", "No"],
  });

  if (answers.uppercase === "Yes") {
    upper = true;
  }
}

async function lower_choice() {
  const answers = await inquirer.prompt({
    name: "lowercase",
    type: "list",
    message: customgradient("Do you want lowercase letters"),
    choices: ["Yes", "No"],
  });

  if (answers.lowercase === "Yes") {
    lower = true;
  }
}

async function numbers_choice() {
  const answers = await inquirer.prompt({
    name: "numbers",
    type: "list",
    message: customgradient("Do you want numbers"),
    choices: ["Yes", "No"],
  });

  if (answers.numbers === "Yes") {
    numbers = true;
  }
}

async function symbols_choice() {
  const answers = await inquirer.prompt({
    name: "symbols",
    type: "list",
    message: customgradient("Do you want symbols"),
    choices: ["Yes", "No"],
  });

  if (answers.symbols === "Yes") {
    symbols = true;
  }
}

async function lenght_choice() {
  const answers = await inquirer.prompt({
    name: "lenght",
    type: "input",
    message: customgradient("Enter the lenght of passwords"),
    default() {
      return 16;
    },
  });

  lenght = answers.lenght;
}

async function amount_choice() {
  const answers = await inquirer.prompt({
    name: "amount",
    type: "input",
    message: customgradient("Enter the amount of passwords"),
    default() {
      return 100;
    },
  });

  amount = answers.amount;
}

function getRandomSample(array, size) {
  var length = array.length,
    start = getRandom(length);

  for (var i = size; i--; ) {
    var index = (start + i) % length,
      rindex = getRandom(length);
    var temp = array[rindex];
    array[rindex] = array[index];
    array[index] = temp;
  }
  var end = start + size,
    sample = array.slice(start, end);
  if (end > length) sample = sample.concat(array.slice(0, end - length));
  return sample;
}

function generate_passwords(upper, lower, nums, symbol, lenght, amount) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
  const lowercase = uppercase.toLocaleLowerCase();
  const numbers = "0123456789";
  const symbols = "()[]{},;:.-_/\\?+*#";
  var all = "";
  var password = "";
  var passwords = [];

  if (upper) {
    all = all + uppercase;
  }
  if (lower) {
    all = all + lowercase;
  }
  if (nums) {
    all = all + numbers;
  }
  if (symbol) {
    all = all + symbols;
  }

  const spinner = createSpinner("Generating passwords...").start();

  for (var x = 0; x < amount; x++) {
    for (var i = 0; i < lenght; i++) {
      var rnum = Math.floor(Math.random() * all.length);
      password = password + all.substring(rnum, rnum + 1);
    }
    passwords.push(password);
    password = "";
  }

  var fd = fs.openSync("passwords.txt", "a");

  passwords.forEach((p) => fs.writeSync(fd, "\n" + p.toString()));

  fs.closeSync(fd);

  spinner.success({
    text: customgradient(`Successfully write ${amount} passwords in passwords.txt`),
  });
}

function reset_file() {
  fs.writeFile("./passwords.txt", "", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

welcome();
reset_file();
await upper_choice();
await lower_choice();
await numbers_choice();
await symbols_choice();
await lenght_choice();
await amount_choice();
generate_passwords(upper, lower, numbers, symbols, lenght, amount);
