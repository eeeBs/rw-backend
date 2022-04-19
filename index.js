const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const passport = require('passport');
const cors = require('cors');
const { Client, Intents } = require('discord.js');

require('dotenv').config()
require('./auth');

const firestore = require('./firestore');
const jsonParser = bodyParser.json()
// Connect Discord Bot to check Roles
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES] })
let guild

client.login(process.env.DISCORD_BOT_TOKEN);
client.on('ready', () => {
    guild = client.guilds.cache.get('280520084324352001', true);
});

const app = express();

// Set CORS permissions
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))

// Initialize express-sessions
app.use(session({
    secret: process.env.DISCORD_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


// # Define Routes

// Simple online check
app.get('/status', (req, res) => {
    res.send(200, true);
});

// Auth starting endpoint
app.get('/auth', passport.authenticate('discord'));

// Auth callback endpoint
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


app.post("/newplayer", jsonParser, (req, res) => {
    console.log(req.body);
    res.send("Character Recived");
});

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