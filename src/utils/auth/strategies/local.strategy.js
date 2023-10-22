const { Strategy } = require("passport-local");
const UserService = require('../../../services/user.service');
const boom = require("@hapi/boom");
const { compare } = require("bcrypt");

const service = new UserService()

const LocalStrategy = new Strategy(async (username, password, done) => {
    try {
        const user = await service.findByUsername(username)
        if (!user) {
            done(boom.unauthorized(), false)
        }
        // user.password
        const isMatch = await compare(password, user.password)
        if (!isMatch) {
            done(boom.unauthorized(), false)
        }
        done(null, user)
    } catch (error) {
        done(error, false)
    }
})

module.exports = LocalStrategy
