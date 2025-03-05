const { Client } = require("revolt.js");
const fs = require("fs");
const path = require("path");
const { QuickDB } = require("quick.db");
require("dotenv").config();
const { initializeShop } = require("./data/shopItems");

const client = new Client(); // No cache option
const db = new QuickDB();

client.commands = new Map();
const messageCooldowns = new Set(); // Prevent spam farming

// Load Commands Function
const loadCommands = (dir) => {
    if (!fs.existsSync(dir)) {
        console.error("[ERROR] Commands folder not found:", dir);
        return;
    }

    const commandFiles = fs.readdirSync(dir);
    for (const file of commandFiles) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            loadCommands(fullPath); // Recursively load subdirectories
        } else if (file.endsWith(".js")) {
            try {
                const command = require(fullPath);
                if (command.name && typeof command.execute === "function") {
                    client.commands.set(command.name, command);
                    console.log(`[✅] Loaded command: ${command.name}`);
                } else {
                    console.warn(`[⚠️] Skipping invalid command file: ${file}`);
                }
            } catch (err) {
                console.error(`[❌] Error loading command file: ${file}`, err);
            }
        }
    }
};

// Load commands from "commands" folder
const commandsPath = path.join(__dirname, "commands");
loadCommands(commandsPath);

// Initialize Inventories on Startup
const initializeInventories = async () => {
    console.log("[🛠️] Initializing user inventories...");
    try {
        const usersWithBalance = await db.all(); // Get all keys in DB

        for (const entry of usersWithBalance) {
            const key = entry.id;

            if (key.startsWith("balance_")) {
                const userId = key.replace("balance_", "");

                // Check if user has an inventory
                let inventory = await db.get(`inventory_${userId}`);
                if (!inventory) {
                    await db.set(`inventory_${userId}`, []);
                    console.log(`🛠️ Initialized inventory for user ${userId}`);
                }
            }
        }

        console.log("✅ All user inventories initialized.");
    } catch (error) {
        console.error("❌ Error initializing inventories:", error);
    }
};

// Message Listener
client.on("message", async (message) => {
    if (!message || !message.content) return; // Prevents null errors

    let serverId = message.serverId; // Check if serverId exists

    // If serverId is missing, fetch it from the channel
    if (!serverId && message.channel_id) {
        try {
            const channel = await client.api.get(`/channels/${message.channel_id}`);
            if (channel && channel.server) {
                serverId = channel.server; // Assign manually
                console.log(`[FIX] Found serverId from channel: ${serverId}`);
            }
        } catch (error) {
            console.error("[ERROR] Failed to fetch channel data:", error);
        }
    }

    if (!serverId) {
        console.log("[ERROR] Still no serverId available.");
        return message.reply("❌ This command can only be used in a server.");
    }

    // 📌 Dynamic Prefix Handling
    const prefix = (await db.get(`prefix_${serverId}`)) || "!"; // Default prefix: "!"
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // 📌 Message-based economy system
    let userId = message.author_id;
    if (!message.author.bot && !messageCooldowns.has(userId)) {
        let earnings = Math.floor(Math.random() * 5) + 1; // Earn 1-5 coins
        await db.add(`balance_${userId}`, earnings);
        console.log(`💰 ${message.author.username} earned ${earnings} coins!`);

        messageCooldowns.add(userId);
        setTimeout(() => messageCooldowns.delete(userId), 10000); // 10-sec cooldown
    }

    // 📌 Command handling
    if (client.commands.has(commandName)) {
        try {
            console.log(`[COMMAND] Executing: ${commandName} in Server: ${serverId}`);
            await client.commands.get(commandName).execute(client, message, args, serverId);
        } catch (error) {
            console.error(`[❌] Error executing command: ${commandName}`, error);
            message.reply("There was an error executing that command.");
        }
    }
});

// Bot Login
client.on("ready", async () => {
    console.log("[✅] Bot is online!");
    
    await initializeInventories(); // Initialize inventories on bot startup
    await initializeShop(); // ✅ Initialize shop on bot startup
});

client.loginBot(process.env.REVOLT_TOKEN).catch((err) => {
    console.error("[❌] Failed to login. Check your token:", err);
});
