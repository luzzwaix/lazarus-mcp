const message = require("./message.cjs");

if (message !== "alive") {
  throw new Error("expected fixture to be alive");
}

console.log(message);
