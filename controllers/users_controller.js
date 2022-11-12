const User = require('../models/user');

module.exports.profile = (req, res) => {
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });
};

module.exports.update = function (req, res) {
    if (req.user.id == req.params.id) {
        User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
            req.flash('success', 'Updated!');
            return res.redirect('back');
        });
    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
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
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) { req.flash('error', err); return; }
        if (!user) {
            User.create(req.body, (err, user) => {
                if (err) { req.flash('error', err); return; }

                return res.redirect('/users/sign-in');
            });
        }
        else {
            req.flash('success', 'You have signed up, login to continue!');
            res.redirect('back');
        }
    });
};

//sign in and create session for user
module.exports.createSession = (req, res) => {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
};

module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'You have logged out!');
        return res.redirect('/');
    });
};