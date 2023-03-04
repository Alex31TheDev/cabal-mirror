import {
    Client,
    WebhookClient
} from "discord.js-selfbot-v13";
import URL from "url";

import Util from "./util/Util.js";
import createLogger from "./util/logger.js";
import MessageTracker from "./util/MessageTracker.js";

import auth from "./config/auth.json" assert { type: "json" };
import config from "./config/config.json" assert { type: "json" };

const wrapEvent = callback => function (...args) {
    try {
        const out = callback(...args);

        if(typeof out === "object" && typeof out.then === "function") {
            out.catch(err => console.error(err));
        }

        return out;
    } catch (err) {
        console.error(err);
    }
};

class SelfbotClient extends Client {
    constructor() {
        super({
            checkUpdate: false
        });

        this.logger = createLogger({
            name: "Cabal",
            filename: config.logFile,
            fileFormat: [
                {
                    name: "timestamp",
                    prop: {
                        format: "YYYY-MM-DD HH:mm:ss",
                    },
                },
                {
                    name: "errors",
                    prop: {
                        stack: true,
                    },
                },
                "json",
            ],
            consoleFormat: [
                {
                    name: "timestamp",
                    prop: {
                        format: "YYYY-MM-DD HH:mm:ss",
                    },
                },
                {
                    name: "printf",
                    prop: ({ level, message, timestamp, stack }) =>
                        `[${timestamp}] - ${level}: ${message}  ${level == "error" ? stack : ""}`,
                },
                "colorize",
            ],
            console: true,
        });

        this.auth = auth;
        this.config = config;

        this.events = [];
    }

    async loadEvents() {
        this.logger.info("Loading events...");

        let ok = 0,
            bad = 0;

        const eventsPath = this.config.eventsPath,
              files = Util.getFilesRecSync(eventsPath).filter(file => file.endsWith(".js"));

        for (const file of files) {
            try {
                let event = await import(URL.pathToFileURL(file));
                event = event.default;

                if (typeof event === "undefined" || typeof event.name === "undefined") {
                    continue;
                }

                const listener = wrapEvent(event.listener.bind(undefined, this));

                if (event.once ?? false) {
                    this.once(event.name, listener);
                } else {
                    this.on(event.name, listener);
                }

                this.events.push(event.name);
                ok++;
            } catch (err) {
                this.logger.error("loadEvents: " + file, err);
                bad++;
            }
        }

        this.logger.info(`Loaded ${ok + bad} events. ${ok} successful, ${bad} failed.`);
    }

    registerWebhook() {
        this.hook = new WebhookClient({
            url: auth.webhookURL
        });
    }

    async sendHookMsg(username, avatar, content) {
        try {
            return await this.hook.send({
                username: username,
                avatarURL: avatar,
                ...content
            });
        } catch(err) {
            await this.hook.send({
                content: ":no_entry_sign: Encountered exception while sending message:",
                ...this.config.cabalIdentity,
                ...Util.getFileAttach(err.stack, "error.js")
            });

            return false;
        }
    }

    checkMsgLocation(msg) {
        return msg.guildId === this.config.botChannel.guildId && msg.channelId === this.config.botChannel.channelId;
    }

    async start() {
        this.logger.info("Starting bot...");

        await this.loadEvents();
        this.registerWebhook();

        this.tracker = new MessageTracker(this.config.msgLimit);

        this.logger.info("Logging in...");
        await this.login(this.auth.token);
    }
}

export default SelfbotClient;