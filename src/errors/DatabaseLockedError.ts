import MoneyMoneyError from "./MoneyMoneyError.js";

export default class DatabaseLockedError extends MoneyMoneyError {
    constructor() {
        super(
            "The MoneyMoney database is locked. Unlock MoneyMoney and try again."
        );
    }
}
