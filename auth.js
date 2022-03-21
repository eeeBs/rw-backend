const passport = require('passport');

const DiscordStrategy = require('passport-discord').Strategy;

const scopes = ['identify', 'guilds', 'guilds.join'];

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK,
    scope: scopes
},
    function (accessToken, refreshToken, user, done) {
        // console.log(...[accessToken, refreshToken, user]);
        return done(null, user);
        // User.findOrCreate({ discordId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
    })
);

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

