function admin (req, res, next) {
    console.log('admin', req.user.role);
    if(req.isAuthenticated() && req.user.role === 'admin') {
        return next()
    }
    return res.redirect('/')
}

module.exports = admin;