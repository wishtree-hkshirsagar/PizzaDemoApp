function superAdmin (req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'superadmin') {
        return next()
    }
    return res.redirect('/')
}

module.exports = superAdmin;