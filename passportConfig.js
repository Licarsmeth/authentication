import passport from "passport"
import {Strategy as LocalStrategy} from "passport-local";
import db from "./database.js";

const getUserByUsernameStmt = db.prepare('SELECT * FROM users WHERE username = ?');

passport.use(
    //telling Passport to use the LocalStrategy for authentication.
  new LocalStrategy((username, password, done) => {
    try {
      // Run the prepared statement to get the user
      const user = getUserByUsernameStmt.get(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);


export default passport;