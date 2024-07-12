const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

const app = express();

const port = process.env.PORT ? process.env.PORT : "3000";

const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

const authController = require("./controllers/auth.js");
const charactersController = require('./controllers/characters.js');
const usersController = require('./controllers/users.js');

const User = require("./models/user.js");

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    })
);
app.use(passUserToView);

app.get('/', async (req, res) => {
    if (req.session.user) {
        const user = await User.findOne(req.session.user);
        req.session.user._id = user._id;
        res.redirect(`/users/${req.session.user._id}/characters`);
    } else {
        res.render('index.ejs');
    }
});

app.use("/auth", authController);
app.use(isSignedIn);
app.use('/users/:userId/characters', charactersController);
app.use('/users/', usersController);
app.use('/users/:userId/roster', usersController);

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});