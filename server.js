var express = require('express'),
    app = express(),
    hbs = require('express-hbs'),
    path = require('path'),
    mongoose  = require('mongoose'),
    connectDb = require('./app/config/database'),
    session = require('express-session'),
    properties = require('./app/config/properties'),
    MongoDbStore = require('connect-mongo'),
    passport = require('passport'),
    passportInit = require('./app/config/passport');



// connect to mongodb
connectDb();

// session configuration
app.use(session({
    name: 'pizza-sid',
    secret: properties.SESSION_SECRET_KEY,
    store: MongoDbStore.create({
        mongoUrl: properties.MONGODB_URL
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 60 * 60 * 1000}, //1 Hour
}));

// to serve static files such as images, css ,js etc
app.use(express.static(path.join(__dirname, 'resources')));

// parser for html forms
app.use(express.urlencoded({extended: false}));

// to recognize the incoming request object as a JSON object
app.use(express.json());

// passport configuration
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())

// require web routes
require('./routes/web')(app);

// configure the view engine
app.engine('hbs', hbs.express4());

// set the view engine
app.set('view engine','hbs');

// configure views path
app.set('views', path.join(__dirname, 'views'));



// set server port
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}`);
});

// Global middleware
app.use((req, res, next) => {
    // res.locals.session = req.session
    // res.locals.user = req.user
    next()
})