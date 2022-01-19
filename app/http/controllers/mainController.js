function mainController() {
    return {
        main(req, res) {
            if(req.user.role === 'superadmin'){
                res.render('main/superAdmin', {
                    uniqueId: req.user.uniqueId,
                    role: req.user.role
                });
            }else if(req.user.role === 'admin'){
                res.render('main/admin', {
                    uniqueId: req.user.uniqueId,
                    role: req.user.role
                });
            }else{
                res.render('main/home', {
                    uniqueId: req.user.uniqueId,
                    role: req.user.role
                });
            }
        }
    }
}

module.exports = mainController;