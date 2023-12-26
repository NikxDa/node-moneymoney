import { addTransaction } from "./transactions.js";

export * from "./accounts.js";
export * from "./categories.js";
export * from "./transactions.js";
export { checkDatabaseUnlocked } from "./utils.js";

addTransaction({
    account: "offline account",
    amount: 20,
    date: new Date(),
    to: "Test payee",
});
