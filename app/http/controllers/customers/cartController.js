function cartController() {
    return {
        index(req, res) {
            res.render('public/index');
        }
    }
}

module.exports = cartController;