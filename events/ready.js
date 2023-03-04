export default {
    name: "ready",
    once: true,
    listener: client => {
        client.logger.info(`The bot is online. Logged in as ${client.user.tag}.`);
    }
};