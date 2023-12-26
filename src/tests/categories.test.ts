import { expect, mock, test } from "bun:test";
import { getCategories } from "../categories";

mock.module("run-applescript", () => ({
    runAppleScript: () =>
        Bun.file("./src/tests/data/exportCategories.data.xml").text(),
}));

test("returns correct number of categories", async () => {
    const categories = await getCategories();

    expect(categories.length).toBe(4);
});

test("returns correct fields for category", async () => {
    const categories = await getCategories();
    const category = categories[0];

    expect(category.budget).toEqual({});
    expect(category.currency).toBe("EUR");
    expect(category.default).toBe(true);
    expect(category.group).toBe(false);
    expect(category.icon).toBeDefined();
    expect(category.indentation).toBe(0);
    expect(category.name).toBe("Uncategorized");
    expect(category.rules).toBe("");
    expect(category.uuid).toBeString();
});
