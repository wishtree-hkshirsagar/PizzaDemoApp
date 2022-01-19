function customer (req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'customer') {
        return next()
    }
    return res.redirect('/')
}

module.exports = customer;