const homeController = require('../app/http/controllers/homeController');
const mainController = require('../app/http/controllers/mainController');
// const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');


function initWebRoutes(app) {
    
    app.get('/', guest, homeController().index);

    app.get('/home', auth, mainController().main);

    app.get('/add/outlet', auth, mainController().main);

    app.get('/edit/outlet/:id', auth, mainController().main);

    app.get('/detail/outlet/:id', auth, mainController().main);

    app.get('/outlets', auth, mainController().main);

    app.get('/pizzas', auth, mainController().main);

    app.get('/add/pizza', auth, mainController().main);

    app.get('/login', guest, homeController().loginPage);

    app.get('/register', guest, homeController().registerPage);

    app.get('/forgotPassword', guest, homeController().forgotPasswordPage);

    app.get('/logout', auth, homeController().logout);

    // app.get('/cart', cartController().index);

   
    
}

module.exports = initWebRoutes;