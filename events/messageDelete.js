import Util from "../util/Util.js";

export default {
    name: "messageDelete",
    listener: async (client, msg) => {
        if(msg.author.bot) {
            return;
        }

        if(!client.checkMsgLocation(msg)) {
            return;
        }

        const prevSentMsg = client.tracker.getMsg(msg.id);

        if(prevSentMsg) {
            const msgLink = Util.getMessageLink(client.config.hookGuildId, prevSentMsg.channel_id, prevSentMsg.id),
                  username = Util.getAuthorDisplayName(msg);

            const content = {
                embeds: [
                    {
                        description: `${username}'s message was deleted: [[Jump to message]](${msgLink})`
                    }
                ]
            };

            await client.sendHookMsg(client.config.cabalIdentity.username, client.config.cabalIdentity.avatarURL, content);
        }

        client.logger.info(`User ${msg.author.id} ("${msg.author.tag}")'s message in channel ${msg.channel.id} ("${msg.channel.name}") was deleted.`);
    }
};