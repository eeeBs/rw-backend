const express = require('express');
const axios = require('axios');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const { Client } = require('discord.js');
const { response } = require('express');
require('dotenv').config()

require('./auth');


const client = new Client({ intents: [] })
let guild
client.on('ready', () => {
    guild = client.guilds.cache.get('280520084324352001');
});

client.login(process.env.DISCORD_BOT_TOKEN);


const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))


app.use(session({
    secret: process.env.DISCORD_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth', passport.authenticate('discord'));

app.get('/callback',
    passport.authenticate('discord', {
        failureRedirect: '/error'
    }), function (req, res) {
        let vice = req.user.guilds.find(guild => guild.id === '280520084324352001');
        if (!vice) {
            res.redirect("https://thevice.us"); // Not in discord
        }
        if (vice) {
            const user = req.user.id;
            guild.members.fetch({ user, force: true }).then((user) => {
                let authed = user._roles.find(role => role === '936444803707719681'); // Check User has Role
                if (authed === '936444803707719681') {
                    res.redirect(process.env.FRONTEND_URL + "/callback") // Successful auth
                } else {
                    res.redirect(process.env.FRONTEND_URL + "/noauth") // Missing Role
                }
            });
        }
    }
);

app.get("/getuser", (req, res) => {
    res.send(req.user);
});

app.get('/error', function (req, res) {
    res.send(`<p>Error: <span>${req.error}</span></p>`)
});
app.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.status(200).send(`<h1>Successfully Logged out! </h1><a href="${process.env.FRONTEND_URL}" style="font-size:24px; color:#01adef;">Back to RaidWerkz</a>`);
});


app.listen(5000, () => console.log('listening on: 5000'))