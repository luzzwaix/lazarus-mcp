const status = "alive";

if (status !== "alive") {
  throw new Error("fixture did not run");
}

console.log(status);
