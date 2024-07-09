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
    const user = await User.findOne(req.session.user);
    req.session.user._id = user._id;
    console.log(req.session.user._id);
    // console.log(user);
    // Check if the user is logged in
    if (req.session.user) {
        // Redirect logged-in users to their applications index
        res.redirect(`/users/${req.session.user._id}/characters`);
    } else {
        // Show the homepage for users who are not logged in
        res.render('index.ejs');
    }
});

// app.get('/', async (req, res) => {
//     const user = await User.findOne(req.session.user);
//     res.render('index.ejs', {
//         user: user,
//     });
// });

app.get('/test', async (req, res) => {
    const userTest2 = JSON.stringify(req.session.user);
    const user3 = await User.findById('668c01221f5378afe3de5017');
    const user4 = await User.findOne();
    const test = String(userTest2);
    res.render('test.ejs', {
        userTest: req.session.user,
        userTest2: userTest2,
        words: "words",
        test: test,
        user3: user3,
        user4: user4,
        // fix user._id issue of not getting stored in session
    });
});

app.use("/auth", authController);
app.use(isSignedIn);
app.use('/users/:userId/characters', charactersController);

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});