const Die = require("./Die");

class DiceParser {
  static parse(args) {
    if (args.length < 3) {
      throw new Error(
        "Error: At least 3 dice must be provided.\n" +
          "Example: node index.js 1,2,3,4,5,6 2,2,2,5,5,5 3,3,3,3,3,3"
      );
    }

    return args.map((arg, idx) => {
      const parts = arg.split(",").map((s) => s.trim());
      if (parts.length !== 6) {
        throw new Error(
          `Error: Invalid die format at argument ${idx + 1}: '${arg}'. ` +
            "Each die must have exactly 6 comma-separated integers."
        );
      }
      const faces = parts.map((p) => {
        const n = Number(p);
        if (!Number.isInteger(n)) {
          throw new Error(
            `Error: Non-integer face value '${p}' in die ${idx + 1}.`
          );
        }
        return n;
      });
      return new Die(faces);
    });
  }
}

module.exports = DiceParser;
