import { formatAppleScript, tellMoneyMoney } from "./utils.js";

export type Transaction = {
    accountNumber?: string;
    accountUuid: string;
    amount: number;
    bankCode?: string;
    booked: boolean;
    bookingDate: Date;
    bookingText?: string;
    categoryUuid: string;
    checkmark: boolean;
    creditorId?: string;
    currency: string;
    id: number;
    mandateReference?: string;
    name: string;
    purpose?: string;
    valueDate: Date;
};

type GetTransactionsOptions = {
    from: Date;
    to?: Date;
    forAccount?: string;
    forCategory?: string;
};

export const getTransactions = async (options: GetTransactionsOptions) => {
    const exportCommand = formatAppleScript`
        export transactions
            for account ${options.forAccount}
            for category ${options.forCategory}
            from date ${options.from}
            to date ${options.to}
            as "plist"
    `;

    type GetTransactionsResponse = {
        creator: string;
        transactions: Transaction[];
    };

    const response = await tellMoneyMoney<GetTransactionsResponse>(
        exportCommand
    );

    return response.transactions;
};

type AddTransactionOptions = {
    account: string;
    date: Date;
    to: string;
    amount: number;
    purpose?: string;
    category?: string;
};

export const addTransaction = async (options: AddTransactionOptions) => {
    const addCommand = formatAppleScript`
        add transaction
            to account ${options.account}
            on date ${options.date}
            to ${options.to}
            amount ${options.amount}
            purpose ${options.purpose}
            category ${options.category}
    `;

    return tellMoneyMoney<void>(addCommand);
};

type SetTransactionOptions = {
    id: number;
    checkmark?: boolean;
    comment?: string;
};

export const setTransaction = (options: SetTransactionOptions) => {
    const setCommand = formatAppleScript`
        set transaction
            id ${options.id}
            checkmark to ${
                options.checkmark !== undefined
                    ? options.checkmark
                        ? "on"
                        : "off"
                    : undefined
            }
            comment to ${options.comment}
    `;

    return tellMoneyMoney<void>(setCommand);
};
