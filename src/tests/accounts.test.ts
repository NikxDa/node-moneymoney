import { expect, mock, test } from "bun:test";
import { AccountType, getAccounts } from "../accounts";

mock.module("run-applescript", () => ({
    runAppleScript: () =>
        Bun.file("./src/tests/data/exportAccounts.data.xml").text(),
}));

test("returns correct number of accounts", async () => {
    const accounts = await getAccounts();

    expect(accounts.length).toBe(4);
});

test("returns correct fields for account group", async () => {
    const accounts = await getAccounts();
    const groupAccount = accounts[0];

    expect(groupAccount.accountNumber).toBe("");
    expect(groupAccount.balance).toEqual([[623.330000000002, "EUR"]]);
    expect(groupAccount.bankCode).toBe("");
    expect(groupAccount.currency).toBe("EUR");
    expect(groupAccount.group).toBe(true);
    expect(groupAccount.icon).toBeDefined();
    expect(groupAccount.indentation).toBe(0);
    expect(groupAccount.name).toBe("All Accounts");
    expect(groupAccount.owner).toBe("");
    expect(groupAccount.portfolio).toBe(false);
    expect(groupAccount.type).toBe(AccountType.GROUP);
    expect(groupAccount.uuid).toBeString();
});

test("returns correct fields for account", async () => {
    const accounts = await getAccounts();
    const account = accounts[2];

    expect(account.accountNumber).toBe("DE02500105170137075030");
    expect(account.balance).toEqual([[123.330000000002, "EUR"]]);
    expect(account.bankCode).toBe("INGDDEFF");
    expect(account.currency).toBe("EUR");
    expect(account.group).toBe(false);
    expect(account.icon).toBeDefined();
    expect(account.indentation).toBe(2);
    expect(account.name).toBe("Giro");
    expect(account.owner).toBe("John Doe");
    expect(account.portfolio).toBe(false);
    expect(account.type).toBe(AccountType.GIRO);
    expect(account.uuid).toBeString();
});
