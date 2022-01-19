function mainController() {
    return {
        main(req, res) {
            res.render('main/home');
        }
    }
}

module.exports = mainController;