# cabal-mirror
Discord ""bot"" for mirroring the messages of a channel. Uses a self-bot and is probably considered a war crime by the Geneva Conventions.

# Config
`config/auth.json` must exist and contain the following lines:

```
{
    "token": "selfbot token",
    "webhookURL": "self explainatory"
}
```

To set the channel which the bot listens on and the error message username edit `config/config.json`.

# 1984
[**Automating normal user accounts (generally called "self-bots") outside of the OAuth2/bot API is forbidden**, and can result in an account termination if found.](https://support.discord.com/hc/en-us/articles/115002192352-Automated-user-accounts-self-bots-) Even though using this is unlikely to get you banned, it is still illegal, thus use this at your own risk. Storing messages like this is also pretty illegal according to Discord TOS and the GDPR.

# TODO

 - [x] Support sending, editing and deleting
 - [x] Support replies
 - [ ] Support images
 - [ ] Support embeds
 - [ ] Support reactions
 - [ ] Support basically everything

# Startup
To start the ""bot"", navigate to the root directory and run `npm start`. Logs will be printed both to the console and to files in the `logs` folder.