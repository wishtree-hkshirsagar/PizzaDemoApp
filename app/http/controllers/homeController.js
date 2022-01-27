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
        },
        homePage(req, res){
            res.render('public/home');
        },
        cartPage(req, res) {
            res.render('public/cart')
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