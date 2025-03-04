const { Client } = require("revolt.js");
const fs = require("fs");
const path = require("path");
const { QuickDB } = require("quick.db");
require("dotenv").config();

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
    if (!message.content.startsWith("!")) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

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
client.on("ready", () => console.log("[✅] Bot is online!"));

client.loginBot(process.env.REVOLT_TOKEN).catch((err) => {
    console.error("[❌] Failed to login. Check your token:", err);
});
