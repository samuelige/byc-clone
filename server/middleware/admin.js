let admin = (req, res, next) => {
    if(req.user.role === 0){
        return res.send('You are not authorized to access this route');
    }
    next();
}

module.exports = {admin};