const authController = require('../app/http/controllers/authController');
const outletController = require('../app/http/controllers/superAdmin/outletController');
const pizzaController = require('../app/http/controllers/admin/pizzaController');
const customerPizzaController = require('../app/http/controllers/customers/customerPizzaController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/adminOrderController');
const publicController = require('../app/http/controllers/public/publicController');
const cartController = require('../app/http/controllers/customers/cartController');
const ownerController = require('../app/http/controllers/superAdmin/ownerController');
const guest = require('../app/http/middleware/guest');
const superAdmin = require('../app/http/middleware/superAdmin');
const admin = require('../app/http/middleware/admin');
const customer = require('../app/http/middleware/customer');

function initApiRoutes(app) {

    // --------------------------------------------------------------------
    //                     authentication routes
    // --------------------------------------------------------------------

    app.post('/v1/api/login', guest, authController().login);

    app.post('/v1/api/register', authController().register);

    app.post('/v1/api/sendEmail', authController().sendEmail);

    app.post('/v1/api/updatePassword', authController().updatePassword);


    
    // --------------------------------------------------------------------
    //                     super admin routes
    // --------------------------------------------------------------------

    app.post('/v1/api/outlet', superAdmin, outletController().createOutlet);

    app.get('/v1/api/outlet', superAdmin, outletController().getAllOutlets);

    app.get('/v1/api/active/outlet', superAdmin, outletController().getAllActiveOutlets);

    app.get('/v1/api/outlet/:id', superAdmin, outletController(). getOutlet);

    app.put('/v1/api/outlet/:id', superAdmin, outletController().updateOutlet);

    app.delete('/v1/api/outlet/:id', superAdmin, outletController().deleteOutlet);

    app.get('/v1/api/owner', superAdmin, ownerController().getAllOwners);


    // --------------------------------------------------------------------
    //                       admin routes
    // --------------------------------------------------------------------

    app.post('/v1/api/pizza', admin, pizzaController().addPizza); 

    app.post('/v1/api/upload', admin, pizzaController().uploadImage);

    app.get('/v1/api/pizza', admin, pizzaController().getAllPizza);

    app.get('/v1/api/pizza/:id', admin, pizzaController().getPizza);

    app.put('/v1/api/pizza/:id', admin, pizzaController().updatePizza);

    app.delete('/v1/api/pizza/:id', admin, pizzaController().deletePizza);

    app.get('/v1/api/order', admin, adminOrderController().getOrders);

    app.post('/v1/api/order/status', admin, adminOrderController().changeOrderStatus);


    // --------------------------------------------------------------------
    //                     customer routes
    // --------------------------------------------------------------------

    app.get('/v1/api/customer/pizza', customer, customerPizzaController().getAllPizza);

    app.get('/v1/api/customer/pizza/:id', customer, customerPizzaController().getPizza);

    app.post('/v1/api/customer/order', customer, orderController().orderPizza);

    app.get('/v1/api/customer/order', customer, orderController().getOrders);

    app.get('/v1/api/customer/order/:id', customer, orderController().getOrder);

    app.post('/v1/api/customer/cart', customer, cartController().addToCart);

    app.put('/v1/api/customer/cart', customer, cartController().removeFromCart);

    app.delete('/v1/api/customer/cart', customer, cartController().emptyCart);

    app.get('/v1/api/customer/cart', customer, cartController().getCartItems);



    // --------------------------------------------------------------------
    //                     public routes
    // --------------------------------------------------------------------

    app.post('/v1/api/cart', guest, publicController().addToCart);

    app.put('/v1/api/cart', guest, publicController().removeFromCart);

    app.delete('/v1/api/cart', guest, publicController().emptyCart);

    app.get('/v1/api/cart', guest, publicController().getCartItems);

    app.get('/v1/api/public/pizza', guest, publicController().getAllPizza);

    app.get('/v1/api/public/pizza/:id', guest, publicController().getPizza);

}

module.exports = initApiRoutes;