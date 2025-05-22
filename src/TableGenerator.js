const Table = require("cli-table3");

class TableGenerator {
  constructor(dice, matrix) {
    this.dice = dice;
    this.matrix = matrix;
  }

  render() {
    console.log("\nProbability of the win for the user:\n");
    const header = ["User \\ Comp", ...this.dice.map((d) => d.toString())];
    const table = new Table({ head: header });
    this.matrix.forEach((row, i) => {
      const cells = row.map((p, j) =>
        i === j ? `- (${p.toFixed(4)})` : p.toFixed(4)
      );
      table.push([this.dice[i].toString(), ...cells]);
    });
    console.log(table.toString());
  }
}

module.exports = TableGenerator;
