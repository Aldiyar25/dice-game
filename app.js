const GameManager = require("./src/GameManager");

(async () => {
  try {
    const gm = new GameManager(process.argv.slice(2));
    await gm.run();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
