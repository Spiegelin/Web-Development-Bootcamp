//jshint esversion:6
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import pg from "pg";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import GoogleStrategy from 'passport-google-oauth20';

// const saltRounds = 10;

// App
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: flase
    //cookie: { secure: true }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

// DB connection
const db = new pg.Client({
    user: process.env.DB_USER,
    host: "localhost",
    database: "world",
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
db.connect();

passport.serializeUser( (user, done) => { done(null, user.id); });

passport.deserializeUser( (id, done) => {User.findById(id, (err, user) => { done(err, user); }); });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    // findOrCreate is a function that is not defined by us, but by passport to tell us to search for a user in our DB
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/auth/google", (req, res) => {
    passport.authenticate("google", {scope: ["profile"]});
});

app.get("/auth/google/secrets", 
    passport.authenticate("google", {failureRedirect: "/login"}),
    (req, res) => {
        res.redirect("/secrets");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/secrets", (req, res) => {
    if(req.isAuthenticated()){
    User.find({"secret": {$ne: null}}, (err, foundUsers) => {
        if(err){
            console.log(err);
        } else {
            res.render("secrets", {usersWithSecrets: foundUsers});
        }
    });
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get("/submit", (req, res) => {
    if(req.isAuthenticated()){
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/submit", (req, res) => {
    const submittedSecret = req.body.secret;
    console.log(req.user.id);
    User.findById(req.user.id, (err, foundUser) => {
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                foundUser.secret = submittedSecret;
                foundUser.save(() => {
                    res.redirect("/secrets");
                });
            }
        }
    });
});

app.post("/register", async (req, res) => {
    
}); 

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});