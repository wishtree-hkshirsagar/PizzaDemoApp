function homeController() {
    return {
        index(req, res) {
            res.render('public/index');
        },
        loginPage(req, res) {
            console.log('7777');
            res.render('public/login');
        },
        registerPage(req, res) {
            res.render('public/signup');
        },
        forgotPasswordPage(req, res) {
            res.render('public/forgot');
        },
        logout(req, res) {
            req.logout();
            req.session.destroy(() =>{
                return res.redirect('/login');
            });
        }
    }
}

module.exports = homeController;