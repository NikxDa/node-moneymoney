import { expect, mock, test } from "bun:test";
import { getTransactions } from "../transactions";

mock.module("../utils", () => ({
    runAppleScript: () =>
        Bun.file("./src/tests/data/exportTransactions.data.xml").text(),
}));

test("returns correct number of transactions", async () => {
    const transactions = await getTransactions({
        from: new Date(),
    });

    expect(transactions.length).toBe(3);
});

test("returns mandatory fields for every transaction", async () => {
    const transactions = await getTransactions({
        from: new Date(),
    });

    for (const transaction of transactions) {
        expect(transaction.accountUuid).toBeString();
        expect(transaction.amount).toBeNumber();
        expect(transaction.booked).toBeBoolean();
        expect(transaction.bookingDate).toBeDate();
        expect(transaction.categoryUuid).toBeString();
        expect(transaction.checkmark).toBeBoolean();
        expect(transaction.currency).toBeString();
        expect(transaction.id).toBeNumber();
        expect(transaction.name).toBeString();
        expect(transaction.valueDate).toBeDate();
    }
});

test("returns optional fields if present", async () => {
    const transactions = await getTransactions({
        from: new Date(),
    });

    const creditCardCharge = transactions[0];
    expect(creditCardCharge.bookingText).toBeString();
    expect(creditCardCharge.purpose).toBeString();

    const recurringBankTransaction = transactions[2];
    expect(recurringBankTransaction.accountNumber).toBeString();
    expect(recurringBankTransaction.bankCode).toBeString();
    expect(recurringBankTransaction.creditorId).toBeString();
    expect(recurringBankTransaction.mandateReference).toBeString();
});
