const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');


function initRoutes(app) {

    app.get('/', homeController().index);

    app.post('/login', authController().login);

    app.post('/register', authController().register);

    app.get('/cart', cartController().index);

   
    
}

module.exports = initRoutes;