function mainController() {
    return {
        main(req, res) {
            if(req.user.role === 'superadmin'){
                res.render('main/superAdmin', {
                    uniqueId: req.user.uniqueId,
                    role: req.user.role,
                    name: req.user.name
                });
            }else if(req.user.role === 'admin'){
                res.render('main/admin', {
                    uniqueId: req.user.uniqueId,
                    role: req.user.role,
                    name: req.user.name
                });
            }else{
                res.render('main/home', {
                    uniqueId: req.user.uniqueId,
                    role: req.user.role,
                    name: req.user.name
                });
            }
        }
    }
}

module.exports = mainController;