module.exports = {
    name: "roleid",
    description: "Get the ID of a role by name or mention.",
    async execute(client, msg, args) {
        try {
            if (!args.length) {
                return msg.channel.sendMessage("❌ Please provide a role name or mention.");
            }

            // Fetch the server
            const server = await client.servers.fetch(msg.channel.server_id);
            if (!server) {
                return msg.channel.sendMessage("❌ Could not fetch server details.");
            }

            // Get all roles in the server
            const roles = server.roles;
            console.log("[DEBUG] Server Roles:", roles);

            let roleId = args[0].replace(/<@&|>/g, ""); // Remove mention formatting
            let role = roles[roleId]; // Get role object by ID

            // If role was not found by mention, search by name
            if (!role) {
                const foundRole = Object.entries(roles).find(([id, r]) => r.name.toLowerCase() === args.join(" ").toLowerCase());
                if (foundRole) {
                    roleId = foundRole[0];
                    role = foundRole[1];
                }
            }

            // If role is found, return the ID
            if (role) {
                return msg.channel.sendMessage(`✅ Role ID for **${role.name}**: \`${roleId}\``);
            } else {
                return msg.channel.sendMessage("❌ Role not found.");
            }
        } catch (error) {
            console.error("[ERROR] Failed to fetch role ID:", error);
            msg.channel.sendMessage("❌ An error occurred while fetching the role ID.");
        }
    }
};
