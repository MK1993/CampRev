const User = require('../models/user')

module.exports.registerView = (req,res)=>{
    res.render('users/register')
}

module.exports.addUser = async(req,res) => {
    try {
        const {username,email,password} = req.body
        const user = new User ({email:email,username:username})
        await User.register(user,password)
        req.flash('success','successfully registered user!')
        res.redirect('/login')
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}

module.exports.loginView = (req,res)=>{
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success','successfully logged in!')
    const url = req.session.redirectUrl || '/campgrounds'
    delete req.session.redirectUrl
    res.redirect(url);
}

module.exports.logout = (req, res)=>{
    req.logout();
    req.flash('success','Successfully logout')
    res.redirect('/campgrounds');
}