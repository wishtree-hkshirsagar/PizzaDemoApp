function auth(req, res, next) {
    console.log('2', req.path)
    if(req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/login')
}

module.exports = auth;