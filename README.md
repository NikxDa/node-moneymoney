# MoneyMoney

> An AppleScript-based API for working with [MoneyMoney](https://moneymoney-app.com) on macOS, written in TypeScript.

<p>
    <img src="https://badgers.space/github/checks/NikxDa/node-moneymoney?label=tests" />
    <img src="https://badgers.space/npm/version/moneymoney" />
</p>

## Installation

Install this package via NPM:

```bash
$ npm i --save moneymoney
```

## Features

The whole code is fully typed, making it easy to work with return types and see which options need to be passed. Not all AppleScript features are currently implemented, but they will be shortly. See the table below for details

| Feature                   | AppleScript API | Node.js API |
|---------------------------|-----------------|-------------|
| Export Accounts           | ✅               | ✅           |
| Export Categories         | ✅               | ✅           |
| Export Transactions       | ✅               | ✅           |
| Export Portfolio          | ✅               | 🚧           |
| Create Bank Transfer      | ✅               | 🚧           |
| Create Batch Transfer     | ✅               | 🚧           |
| Create Direct Debit       | ✅               | 🚧           |
| Create Batch Direct Debit | ✅               | 🚧           |
| Add Transaction           | ✅               | ✅           |
| Update Transaction        | ✅               | ✅           |
| Check Unlock Status       | ❌               | ✅           |

## Usage

All available functions are exported from the `moneymoney` package. The whole API is Promise-based, meaning you need to await the returned promises before being able to work with the results.

> [!WARNING]  
> All methods interfacing with MoneyMoney require the application to be unlocked. If the application is locked, a `DatabaseLockedError` will be thrown. You need to handle this error in your application yourself.

Example:

```js
import { DatabaseLockedError, getTransactions } from "moneymoney";

async function handleDatabaseLocked(err) {
    if (err instanceof DatabaseLockedError) {
        console.log("Please unlock MoneyMoney to count the transactions.");
        return null;
    } else {
        throw err;
    }
}

async function countTransactions() {
    const transactions = await getTransactions({
        from: new Date(),
    }).catch(handleDatabaseLocked);

    if (transactions !== null) {
        console.log(`There are ${transactions.length} transactions.`);
    }
}

countTransactions();
```