const { QuickDB } = require("quick.db");
const db = new QuickDB();

const shopItems = [
    { id: 1, name: "Health Potion", price: 50 },
    { id: 2, name: "Magic Scroll", price: 100 },
    { id: 3, name: "Guild Membership", price: 1000 },
    { id: 4, name: "Official Test Launch", price: 0 },
    { id: 5, name: "Seal of Krampus Approval", price: 100 },
    { id: 6, name: "Soba (Limited Time)", price: 1000 }
];

// ✅ Store shop items in QuickDB (only once)
async function initializeShop() {
    const existingShop = await db.get("shop");
    if (!existingShop || existingShop.length === 0) {
        await db.set("shop", shopItems);
        console.log("✅ Shop items have been stored in QuickDB!");
    } else {
        console.log("✅ Shop is already initialized.");
    }
}

module.exports = { shopItems, initializeShop };
