function homeController() {
    return {
        index(req, res) {
            res.render('public/index');
        },
        loginPage(req, res) {
            res.render('public/login');
        },
        registerPage(req, res) {
            res.render('public/signup');
        },
        forgotPasswordPage(req, res) {
            res.render('public/forgot');
        }
    }
}

module.exports = homeController;