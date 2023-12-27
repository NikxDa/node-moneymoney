import { describe, expect, mock, test } from "bun:test";
import DatabaseLockedError from "../errors/DatabaseLockedError";
import MoneyMoneyError from "../errors/MoneyMoneyError";
import {
    checkDatabaseUnlocked,
    formatAppleScript,
    handleAppleScriptError,
} from "../utils";

describe("checkDatabaseUnlocked", () => {
    test("returns true if there is a result", async () => {
        mock.module("../utils", () => ({
            runAppleScript: () =>
                Bun.file(
                    "./src/tests/data/exportTransactionsEmpty.data.xml"
                ).text(),
        }));

        const result = await checkDatabaseUnlocked();
        expect(result).toBe(true);
    });

    test("returns false if there is an error", async () => {
        mock.module("../utils", () => ({
            runAppleScript: () => {
                throw new DatabaseLockedError();
            },
        }));

        const result = await checkDatabaseUnlocked();
        expect(result).toBe(false);
    });
});

describe("formatAppleScript", () => {
    test("correctly interpolates strings", () => {
        const formattedString = formatAppleScript`a ${"str"} b`;
        expect(formattedString).toBe(`a "str" b`);
    });

    test("correctly interpolates numbers", () => {
        const formattedString = formatAppleScript`a ${123} b`;
        expect(formattedString).toBe(`a 123 b`);
    });

    test("correctly interpolates dates", () => {
        const date = new Date(2023, 0, 15, 12, 0, 0);
        const formattedString = formatAppleScript`a ${date} b`;
        expect(formattedString).toBe(`a "2023-01-15" b`);
    });

    test("removes undefined segments", () => {
        const formattedString = formatAppleScript`a ${123} b ${undefined} c`;
        expect(formattedString).toBe(`a 123 c`);
    });

    test("trims and removes unnecessary whitespaces", () => {
        const formattedString = formatAppleScript`   a    \t\tb\n\n  c   `;
        expect(formattedString).toBe("a b c");
    });
});

describe("handleAppleScriptError", () => {
    test("throws if the error is not an Error object", () => {
        expect(() => handleAppleScriptError(123)).toThrow(
            new MoneyMoneyError("Unknown error.")
        );
    });

    test("throws if the error is unknown", () => {
        const error = new Error("Some unknown error");
        expect(() => handleAppleScriptError(error)).toThrow(
            new MoneyMoneyError("Unknown error.")
        );
    });

    test("throws if the database is locked", () => {
        const error = new Error("MoneyMoney got an error: Locked database.");
        expect(() => handleAppleScriptError(error)).toThrow(
            new DatabaseLockedError()
        );
    });
});
