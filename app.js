import express from "express";
import session from "express-session"
import passport from "passport"
import {Strategy as LocalStrategy} from "passport-local";
import Database from "better-sqlite3";
import fs from "fs";

const app = express();
app.set("view engine", "ejs");
const db = new Database("./sql.db");
const schema = fs.readFileSync('./schema.sql', 'utf8');
db.exec(schema);

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("index"));
app.get("/sign-up", (req, res) => res.render("sign-up-form"));

const insertUserStmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');

app.post('/sign-up', async (req, res, next) => {
  try {
    // Run the prepared statement with user input
    insertUserStmt.run(req.body.username, req.body.password);
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
});


app.listen(5173, () => console.log("app listening on port 5173")); 
