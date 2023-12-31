import { tellMoneyMoney } from "./utils.js";

type AccountBalance = [number, string];

export enum AccountType {
    GIRO = "Giro account",
    SAVINGS = "Savings account",
    FIXED_TERM_DEPOSIT = "Fixed term deposit",
    LOAN = "Loan account",
    CREDIT_CARD = "Credit card",
    OTHER = "Other",
    GROUP = "Account group",
}

export type Account = {
    accountNumber: string;
    // attributes: any; TODO: Figure out what this is
    balance: AccountBalance[];
    bankCode: string;
    currency: string;
    group: boolean;
    icon: Buffer;
    indentation: number;
    name: string;
    owner: string;
    portfolio: boolean;
    type: AccountType;
    uuid: string;
};

export const getAccounts = () => {
    return tellMoneyMoney<Account[]>("export accounts");
};
