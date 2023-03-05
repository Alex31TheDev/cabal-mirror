import Util from "../util/Util.js";

const nickTag = " - Deleted";

export default {
    name: "messageDelete",
    listener: async (client, msg) => {
        if(msg.author.bot) {
            return;
        }

        if(!client.checkMsgLocation(msg)) {
            return;
        }

        let username = Util.getAuthorDisplayName(msg);
        username = username.slice(0, 32 - nickTag.length) + nickTag;

        const avatar = msg.author.displayAvatarURL(),
              prevSentMsg = client.tracker.getMsg(msg.id),
              content = {};


        if(prevSentMsg) {
            const msgLink = Util.getMessageLink(client.config.hookGuildId, prevSentMsg.channel_id, prevSentMsg.id);

            content.embeds = [
                {
                    description: `Deleted: [[Jump to message]](${msgLink})`
                }
            ];
        }
        
        await client.sendHookMsg(username, avatar, content);

        client.logger.info(`User ${msg.author.id} ("${msg.author.tag}")'s message in channel ${msg.channel.id} ("${msg.channel.name}") was deleted.`);
    }
};