var express = require('express'),
    app = express(),
    hbs = require('express-hbs'),
    path = require('path');




app.get('/', (req, res) => {
    res.render('public/index');
});

// to serve static files such as images, css ,js etc
app.use(express.static(path.join(__dirname, 'resources')));

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