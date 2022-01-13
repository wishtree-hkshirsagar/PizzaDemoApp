function homeController() {
    return {
        index(req, res) {
            res.render('public/index');
        }
    }
}

module.exports = homeController;