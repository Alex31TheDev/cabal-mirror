import fs from "fs";
import path from "path";

const Util = {
    getFilesRecSync: dir_path => {
        const files = [];
        
        function recursiveFunc(dir_path, arr) {
            fs.readdirSync(dir_path).forEach(itm => {
                const itmPath = path.resolve(dir_path, itm);
                
                if(fs.statSync(itmPath).isDirectory()) {
                    recursiveFunc(itmPath, arr);
                } else {
                    arr.push(itmPath);
                }
            });
        }
        
        recursiveFunc(dir_path, files);

        return files;
    },
    getFileAttach: (data, name = "message.txt") => ({
        files: [
            {
                name: name,
                attachment: Buffer.from(data)
            }
        ]
    }),
    getAuthorDisplayName: msg => {
        const member = msg.guild.members.cache.get(msg.author.id);
        return member?.nickname ?? msg.author.username;
    },
    getMessageLink: (guild_id, channel_id, msg_id) => `https://discord.com/channels/${guild_id}/${channel_id}/${msg_id}`
};

export default Util;