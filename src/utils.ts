import { execFile } from "child_process";
import plist from "plist";
import { promisify } from "util";
import DatabaseLockedError from "./errors/DatabaseLockedError.js";
import MoneyMoneyError from "./errors/MoneyMoneyError.js";

const execFileAsync = promisify(execFile);

export async function runAppleScript(script: string) {
    if (process.platform !== "darwin") {
        throw new Error("AppleScript is only available on macOS.");
    }

    const { stdout } = await execFileAsync("osascript", ["-e", script]);
    return stdout?.trim() ?? ""; // Need to do this because of Bun issue #7850
}

export const tellMoneyMoney = async <T = never>(command: string) => {
    const script = `
        tell application "MoneyMoney"
            ${command}
        end tell
    `;

    const result = await runAppleScript(script).catch(handleAppleScriptError);
    if (result.length === 0) return undefined as T;

    const parsedResult = plist.parse(result);
    return parsedResult as T;
};

export const checkDatabaseUnlocked = async () => {
    try {
        await tellMoneyMoney(
            `export transactions from date "2024-01-01" as "plist"`
        );

        return true;
    } catch (_) {
        return false;
    }
};

export const handleAppleScriptError = (err: any) => {
    if (err instanceof Error && err.message.includes("Locked database")) {
        throw new DatabaseLockedError();
    }

    throw new MoneyMoneyError("Unknown error.");
};

export const formatDate = (date: Date) => {
    const fullYear = date.getFullYear();
    const month = date.getMonth() + 1;
    const dayOfMonth = date.getDate();

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${fullYear}-${pad(month)}-${pad(dayOfMonth)}`;
};

type AppleScriptValues = string | Date | number | undefined;

export const formatAppleScript = (
    strings: TemplateStringsArray,
    ...values: AppleScriptValues[]
) => {
    let result = "";

    for (let i = 0; i < strings.length; i++) {
        if (i < values.length) {
            const value = values[i];

            switch (typeof value) {
                case "undefined":
                    // If the value is undefined, don't add the previous string, either
                    break;
                case "string":
                    result += strings[i];
                    result += `"${value}"`;
                    break;
                case "number":
                    result += strings[i];
                    result += value;
                    break;
                case "object":
                    result += strings[i];
                    result += `"${formatDate(value)}"`;
                    break;
                default:
                    throw new Error(
                        "Unsupported type passed to appleScript tagged template literal: " +
                            typeof value
                    );
            }
        }
    }

    if (strings.length > values.length) {
        result += strings[strings.length - 1];
    }

    return result.replaceAll(/[\s]+/g, " ").trim();
};
