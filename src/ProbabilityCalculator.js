class ProbabilityCalculator {
  constructor(dice) {
    this.dice = dice;
  }

  computeMatrix() {
    const n = this.dice.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let wins = 0;
        for (const a of this.dice[i].faces) {
          for (const b of this.dice[j].faces) {
            if (a > b) wins++;
          }
        }
        matrix[i][j] = wins / 36;
      }
    }
    return matrix;
  }
}

module.exports = ProbabilityCalculator;
