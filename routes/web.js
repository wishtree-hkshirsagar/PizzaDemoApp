const homeController = require('../app/http/controllers/homeController');
const mainController = require('../app/http/controllers/mainController');
const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');


function initWebRoutes(app) {
    
    app.get('/', guest, homeController().index);

    app.get('/home', auth, mainController().main);

    app.get('/login', guest, homeController().loginPage);

    // app.post('/v1/api/login', guest, authController().login);

    app.get('/register', guest, homeController().registerPage);

    // app.post('/v1/api/register', authController().register);

    app.get('/forgotPassword', guest, homeController().forgotPasswordPage);

    app.get('/cart', cartController().index);

   
    
}

module.exports = initWebRoutes;