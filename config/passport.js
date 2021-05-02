const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
    },
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
    
            if (!user)
                return done(null, false, { message: 'User does not exist' });
            if (!await bcrypt.compare(password, user.password))
                return done(null, false, { message: 'Incorrect password' });
    
            return done(null, user);
        } catch (e) {
            done(e);
        }
    }
));

passport.use(new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
        const user = await User.findById(jwtPayload.id).catch(done);
        return done(null, user);
    }
));