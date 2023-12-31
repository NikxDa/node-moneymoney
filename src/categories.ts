import { tellMoneyMoney } from "./utils.js";

type Budget = {
    amount: number;
    available: number;
    period: "monthly" | "yearly" | "quarterly" | "total";
};

type CategoryDefault =
    | {
          default: true;
          budget: {};
      }
    | {
          default: false;
          budget: Budget;
      };

export type Category = CategoryDefault & {
    currency: string;
    group: boolean;
    icon: Buffer;
    indentation: number;
    name: string;
    rules: string;
    uuid: string;
};

export const getCategories = () => {
    return tellMoneyMoney<Category[]>("export categories");
};
