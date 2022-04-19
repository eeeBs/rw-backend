const firestore = require('./firestore');

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const scopes = ['identify', 'guilds', 'guilds.join'];

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK,
    scope: scopes
},
    function (accessToken, refreshToken, user, done) {
        const u = firestore.users.doc(user.id).get();
        if (u.exsits) {
            u.set({
                username: user.username,
                avatar: user.avatar,
                lastLogin: Date.now()
            })
        } else {
            firestore.users.doc(user.id).set({
                username: user.username,
                avatar: user.avatar,
                lastLogin: Date.now()
            });
        }
        return done(null, user);
    })
);

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

