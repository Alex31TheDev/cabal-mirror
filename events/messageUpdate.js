import Util from "../util/Util.js";

const nickTag = " - Edited";

export default {
    name: "messageUpdate",
    listener: async (client, oldMsg, newMsg) => {
        if(newMsg.author.bot) {
            return;
        }

        if(!client.checkMsgLocation(newMsg)) {
            return;
        }

        let username = Util.getAuthorDisplayName(newMsg);
        username = username.slice(0, 32 - nickTag.length) + nickTag;

        const avatar = newMsg.author.displayAvatarURL(),
              prevSentMsg = client.tracker.getMsg(oldMsg.id),
              content = {
            content: newMsg.content
        };

        if(prevSentMsg) {
            const msgLink = Util.getMessageLink(client.config.hookGuildId, prevSentMsg.channel_id, prevSentMsg.id);

            content.embeds = [
                {
                    description: `Original: [[Jump to message]](${msgLink})`
                }
            ];
        }
        
        await client.sendHookMsg(username, avatar, content);

        client.logger.info(`User ${newMsg.author.id} ("${newMsg.author.tag}") edited a message in channel ${newMsg.channel.id} ("${newMsg.channel.name}").`);
    }
};