const User = require('../models/user');

module.exports.profile = (req, res) => {
    res.render('user_profile', {
        title: "User Profile"
    });
};

//render the Sign Up
module.exports.signUp = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
};

//render the Sign In
module.exports.signIn = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    res.render('user_sign_in', {
        title: "Codeial | Sign In",
    });
};

//get the sign up data
module.exports.create = (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) { console.log('error in finding user'); return; }
        if (!user) {
            User.create(req.body, (err, user) => {
                if (err) { console.log('error in finding user'); return; }

                res.redirect('/users/sign-in');
            });
        }
        else {
            res.redirect('back');
        }
    });
};

//sign in and create session for user
module.exports.createSession = (req, res) => {
    res.redirect('/');
};

module.exports.destroySession = function (req, res) {
    req.logout();

    return res.redirect('/');
};