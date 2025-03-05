const { QuickDB } = require("quick.db");
const adminRoleNames = require("../../data/adminRoles");
const db = new QuickDB();

module.exports = {
    name: "setwelcome",
    description: "Sets a custom welcome message for new members.",
    category: "Owner",
    execute: async (client, msg, args) => {
        try {
            const server = await client.servers.fetch(msg.channel.server_id);
            const member = await server.fetchMember(msg.author_id);

            // Check if the sender has any of the admin roles
            const isAdmin = member.roles.some(roleId => {
                const role = server.roles[roleId];
                return role && adminRoleNames.includes(role.name); // Check for admin role
            });

            if (!isAdmin) {
                return msg.channel.sendMessage("❌ You must have an admin role to use this command.");
            }

            // Validate the input
            const welcomeMessage = args.join(" ");
            if (!welcomeMessage) {
                return msg.channel.sendMessage("❌ Please provide a welcome message.");
            }

            // Save the welcome message to the database
            await db.set(`welcomeMessage_${server.id}`, welcomeMessage);

            // Get or create the Welcome's and Leaves channel
            const channel = server.channels.find(ch => ch.name.toLowerCase() === "welcome's and leaves");

            if (!channel) {
                return msg.channel.sendMessage("❌ Could not find a channel named 'Welcome's and Leaves'. Please make sure it exists.");
            }

            // Send the welcome message to the channel
            await channel.sendMessage(`✅ Welcome message set successfully! New members will be greeted with: "${welcomeMessage}"`);
        } catch (error) {
            console.error("[ERROR] Failed to set welcome message:", error);
            msg.channel.sendMessage("❌ An error occurred while processing the command.");
        }
    }
};
