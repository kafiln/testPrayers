const gen = require("./gen");
const [name, id] = process.argv.slice(2);

gen(name, id);
