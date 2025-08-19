const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/authModel");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]);
  opts.secretOrKey = process.env.JWT_SECRET_KEY;

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.userId).select(
          "-password"
        );
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        console.error("Error in passport logic:", error);
        return done(error, false);
      }
    })
  );
};