const crypto = require("crypto");

class CommitRevealRNG {
  constructor(mod) {
    this.mod = mod;
    this.secret = crypto.randomBytes(32);
    this.value = crypto.randomInt(mod);
    this.commit = crypto
      .createHmac("sha3-256", this.secret)
      .update(this.value.toString())
      .digest("hex");
  }

  showCommit() {
    console.log(`HMAC=${this.commit}`);
  }

  reveal(userInput) {
    const userVal = Number(userInput);
    if (!Number.isInteger(userVal) || userVal < 0 || userVal >= this.mod) {
      throw new Error(`Error: input must be integer 0..${this.mod - 1}.`);
    }
    console.log(`KEY=${this.secret.toString("hex")}`);
    console.log(`My number is ${this.value}.`);
    const combined = (this.value + userVal) % this.mod;
    console.log(
      `The result is ${this.value} + ${userVal} = ${combined} (mod ${this.mod}).`
    );
    return combined;
  }
}

module.exports = CommitRevealRNG;
