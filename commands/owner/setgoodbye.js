const { QuickDB } = require("quick.db");
const { adminRoles } = require("../../data/roles.js"); // Destructure to get adminRoles
const db = new QuickDB();

module.exports = {
    name: "setgoodbye",
    description: "Sets a custom goodbye message for when members leave the server.",
    category: "Owner",
    execute: async (client, msg, args) => {
        try {
            // Fetch the server from the channel
            const serverId = msg.channel.server_id;
            const server = await client.servers.fetch(serverId);

            // Fetch the member to check their roles
            const member = await server.fetchMember(msg.author_id);

            // Check if the sender has any of the admin roles
            const isAdmin = member.roles.some(roleId => {
                const role = server.roles[roleId]; // Correct way to access roles in Revolt.js
                return role && adminRoles.includes(role.name); // Check for admin role
            });

            if (!isAdmin) {
                return msg.channel.sendMessage("❌ You must have an admin role to use this command.");
            }

            // Validate the input for the goodbye message
            const goodbyeMessage = args.join(" ");
            if (!goodbyeMessage) {
                return msg.channel.sendMessage("❌ Please provide a goodbye message.");
            }

            // Save the goodbye message to the database
            await db.set(`goodbyeMessage_${serverId}`, goodbyeMessage);

            // Get or create the Welcome's and Leaves channel
            const channel = server.channels.find(ch => ch.name.toLowerCase() === "welcome's and leaves");

            if (!channel) {
                return msg.channel.sendMessage("❌ Could not find a channel named 'Welcome's and Leaves'. Please make sure it exists.");
            }

            // Send the goodbye message to the channel
            await channel.sendMessage(`✅ Goodbye message set successfully! Members who leave will be greeted with: "${goodbyeMessage}"`);
        } catch (error) {
            console.error("[ERROR] Failed to set goodbye message:", error);
            msg.channel.sendMessage("❌ An error occurred while processing the command.");
        }
    },

    // Event listener for when a member joins the server
    onGuildMemberAdd: async (member) => {
        try {
            const serverId = member.guild.id;
            const goodbyeMessage = await db.get(`goodbyeMessage_${serverId}`);

            if (!goodbyeMessage) {
                return;
            }

            // Get the 'Welcome's and Leaves' channel
            const channel = member.guild.channels.find(ch => ch.name.toLowerCase() === "welcome's and leaves");

            if (channel) {
                await channel.sendMessage(`👋 Welcome, ${member.user.username}!`);
            }
        } catch (error) {
            console.error("[ERROR] Failed to handle member join:", error);
        }
    },

    // Event listener for when a member leaves the server
    onGuildMemberRemove: async (member) => {
        try {
            const serverId = member.guild.id;
            const goodbyeMessage = await db.get(`goodbyeMessage_${serverId}`);

            if (!goodbyeMessage) {
                return;
            }

            // Get the 'Welcome's and Leaves' channel
            const channel = member.guild.channels.find(ch => ch.name.toLowerCase() === "welcome's and leaves");

            if (channel) {
                await channel.sendMessage(goodbyeMessage.replace("{user}", member.user.username));
            }
        } catch (error) {
            console.error("[ERROR] Failed to handle member leave:", error);
        }
    }
};
