import Util from "../util/Util.js";

const nickTag = " - Reply";

export default {
    name: "messageCreate",
    listener: async (client, msg) => {
        if(msg.author.bot) {
            return;
        }

        if(!client.checkMsgLocation(msg)) {
            return;
        }

        let username = Util.getAuthorDisplayName(msg);

        const avatar = msg.author.displayAvatarURL(),
              content = {
            content: msg.content
        };

        if(msg.type === "REPLY") {
            const prevSentMsg = client.tracker.getMsg(msg.reference.messageId);
            username = username.slice(0, 32 - nickTag.length) + nickTag;

            if(prevSentMsg) {
                const msgLink = Util.getMessageLink(client.config.hookGuildID, prevSentMsg.channel_id, prevSentMsg.id),
                      replyName = Util.getAuthorDisplayName(await msg.fetchReference());

                content.embeds = [
                    {
                        description: `Replied to ${replyName}: [[Jump to message]](${msgLink})`
                    }
                ];
            }
        }
        
        const sentMsg = await client.sendHookMsg(username, avatar, content);
        
        if(sentMsg) {
            client.tracker.addMsg(sentMsg, msg.id);
        }

        client.logger.info(`User ${msg.author.id} ("${msg.author.tag}") sent a message in channel ${msg.channel.id} ("${msg.channel.name}").`);
    }
};