const crypto = require("crypto");
const prompt = require("prompt-sync")({ sigint: true });
const CommitRevealRNG = require("./CommitRevealRNG");
const ProbabilityCalculator = require("./ProbabilityCalculator");
const TableGenerator = require("./TableGenerator");
const DiceParser = require("./DiceParser");

class GameManager {
  constructor(argv) {
    this.dice = DiceParser.parse(argv);
    this.firstPlayer = null;
  }

  determineFirstPlayer() {
    console.log("Let's determine who makes the first move.");
    const rng = new CommitRevealRNG(2);
    console.log(
      `I selected a random value in the range 0..1 (HMAC=${rng.commit}).`
    );
    console.log("Try to guess my selection.");
    console.log("0 - 0");
    console.log("1 - 1");
    console.log("X - exit");
    console.log("? - help");
    while (true) {
      const input = prompt("Your selection: ").trim();
      if (input.toUpperCase() === "X") {
        console.log("Exiting.");
        process.exit(0);
      }
      if (input === "?") {
        continue;
      }
      if (input === "0" || input === "1") {
        const combined = rng.reveal(input);
        console.log(
          combined === 0
            ? "You guessed correctly. You make the first move."
            : "You guessed wrong. I make the first move."
        );
        return combined;
      }
      console.log("Invalid input. Enter 0, 1, X or ?.");
    }
  }

  promptUserDie(forbidden = []) {
    while (true) {
      console.log("\nChoose your dice:");
      this.dice.forEach((d, i) => {
        if (!forbidden.includes(i)) console.log(`${i} - ${d.toString()}`);
      });
      console.log("X - exit");
      console.log("? - help (show win probability table)");
      const input = prompt("Your selection: ").trim();
      if (input.toUpperCase() === "X") {
        console.log("Exiting.");
        process.exit(0);
      }
      if (input === "?") {
        const matrix = new ProbabilityCalculator(this.dice).computeMatrix();
        new TableGenerator(this.dice, matrix).render();
        continue;
      }
      const idx = Number(input);
      if (
        Number.isInteger(idx) &&
        idx >= 0 &&
        idx < this.dice.length &&
        !forbidden.includes(idx)
      ) {
        console.log(`You chose die [${idx}] ${this.dice[idx].toString()}`);
        return idx;
      }
      console.log("Invalid selection. Try again.");
    }
  }

  chooseComputerDie(first, userChoice) {
    let idx;
    if (first) {
      idx = crypto.randomInt(this.dice.length);
    } else {
      const matrix = new ProbabilityCalculator(this.dice).computeMatrix();
      idx = this.dice
        .map((_, i) => i)
        .filter((i) => i !== userChoice)
        .reduce((best, i) =>
          matrix[i][userChoice] > matrix[best][userChoice] ? i : best
        );
    }
    console.log(`I choose the [${idx}] ${this.dice[idx].toString()} dice.`);
    return idx;
  }

  rollFair(role, dieIdx) {
    console.log(`\nIt's time for ${role === "user" ? "your" : "my"} throw.`);
    const rng = new CommitRevealRNG(6);
    console.log(
      `I selected a random value in the range 0..5 (HMAC=${rng.commit}).`
    );
    console.log("Choose a number between 0 and 5:");
    [0, 1, 2, 3, 4, 5].forEach((n) => console.log(`${n} - ${n}`));
    console.log("X - exit");
    console.log("? - help");
    while (true) {
      const input = prompt("Your selection: ").trim();
      if (input.toUpperCase() === "X") {
        console.log("Exiting.");
        process.exit(0);
      }
      if (input === "?") {
        console.log(`HMAC=${rng.commit}`);
        continue;
      }
      if (/^[0-5]$/.test(input)) {
        const combined = rng.reveal(input);
        const face = this.dice[dieIdx].getFace(combined);
        console.log(
          `${role === "user" ? "Your" : "My"} throw result is ${face}.`
        );
        return face;
      }
      console.log("Invalid input. Enter 0–5, X or ?.");
    }
  }

  async run() {
    console.log("Welcome to the non-transitive dice game!");
    console.log(`Loaded ${this.dice.length} dice:`);
    this.dice.forEach((d, i) => console.log(`  [${i}] ${d.toString()}`));

    this.firstPlayer = this.determineFirstPlayer();

    let userDie, compDie;
    if (this.firstPlayer === 0) {
      userDie = this.promptUserDie();
      compDie = this.chooseComputerDie(false, userDie);
    } else {
      compDie = this.chooseComputerDie(true);
      userDie = this.promptUserDie([compDie]);
    }

    console.log(
      `\nAssignments: You=[${userDie}] ${this.dice[userDie]}, Me=[${compDie}] ${this.dice[compDie]}`
    );

    while (true) {
      const order =
        this.firstPlayer === 0 ? ["user", "computer"] : ["computer", "user"];
      const vals = order.map((role) =>
        this.rollFair(role, role === "user" ? userDie : compDie)
      );
      if (vals[0] !== vals[1]) {
        const winner =
          vals[0] > vals[1]
            ? order[0] === "user"
              ? "You win"
              : "I win"
            : order[1] === "user"
            ? "You win"
            : "I win";
        console.log(`\n${winner} (${vals[0]} vs ${vals[1]})!`);
        break;
      }
      console.log(`\nTie (${vals[0]} = ${vals[1]}), rolling again...`);
    }
  }
}

module.exports = GameManager;
