/*
create bank transfer v
create bank transfer
[from account text] : UUID, IBAN, account number or account name.
[to text] : Recipient name.
[iban text] : Recipient IBAN.
[bic text] : Recipient BIC.
[amount real] : Amount in Euro.
[purpose text] : Purpose text.
[endtoend reference text] : SEPA end-to-end reference.
[purpose code text] : SEPA purpose code.
[instrument code text] : SEPA local instrument code. Use TRF for normal payments and INST for instant payments. Default is TRF.
[scheduled date any] : Scheduled date (YYYY-MM-DD).
[into text] : By default a payment window will be opened. If this parameter is set to "outbox", the payment will be silently saved into the outbox instead.
*/

import { formatAppleScript, tellMoneyMoney } from "./utils.js";

type CreateBankTransferOptions = {
    fromAccount?: string;
    to?: string;
    iban?: string;
    bic?: string;
    amount?: number;
    purpose?: string;
    sepaEndToEndReference?: string;
    sepaPurposeCode?: string;
    sepaInstrumentCode?: "TRF" | "INST";
    scheduledDate?: Date;
    saveToOutbox?: boolean;
};

export const createBankTransfer = (options: CreateBankTransferOptions = {}) => {
    const createBankTransferCommand = formatAppleScript`
        create bank transfer
            from account ${options.fromAccount}
            to ${options.to}
            iban ${options.iban}
            bic ${options.bic}
            amount ${options.amount}
            purpose ${options.purpose}
            endtoend reference ${options.sepaEndToEndReference}
            purpose code ${options.sepaPurposeCode}
            instrument code ${options.sepaInstrumentCode}
            scheduled date ${options.scheduledDate}
            into ${options.saveToOutbox ? "outbox" : undefined}
    `;

    return tellMoneyMoney<void>(createBankTransferCommand);
};
