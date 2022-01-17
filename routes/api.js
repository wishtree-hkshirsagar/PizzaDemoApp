const authController = require('../app/http/controllers/authController');
const guest = require('../app/http/middleware/guest');

function initApiRoutes(app) {

    app.post('/v1/api/login', guest, authController().login);

    app.post('/v1/api/register', authController().register);

    app.post('/v1/api/sendEmail', authController().sendEmail);

    app.post('/v1/api/updatePassword', authController().updatePassword);
}

module.exports = initApiRoutes;