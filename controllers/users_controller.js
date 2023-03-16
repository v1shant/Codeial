const User = require('../models/user');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const userEmailWorker = require('../worker/user_email_worker');
const crypto = require('crypto');

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

module.exports.resetPassword = function (req, res) {
    return res.render('reset_password',
        {
            title: 'Codeial | Reset Password',
            access: false
        });
};

module.exports.resetPassMail = function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {

        if (err) { console.log('Error in finding user', err); return; }

        if (user) {
            if (user.isTokenValid == false) {
                user.accessToken = crypto.randomBytes(20).toString('hex');
                user.isTokenValid = true;
                user.save();
            }

            let job = queue.create('user-emails', user).save(function (err) {
                if (err) { console.log('Error in sending to the queue', err); return; }
            });

            req.flash('success', 'Password reset link sent. Please check your mail');
            return res.redirect('/');
        }
        else {
            req.flash('error', 'User not found. Try again!');
            return res.redirect('back');
        }
    });
};

module.exports.setPassword = function (req, res) {
    User.findOne({ accessToken: req.params.accessToken }, function (err, user) {
        if (err) {
            console.log('Error in finding user', err);
            return;
        }
        if (user.isTokenValid) {
            return res.render('reset_password',
                {
                    title: 'Codeial | Reset Password',
                    access: true,
                    accessToken: req.params.accessToken
                });
        }
        else {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    });
};

module.exports.updatePassword = function (req, res) {
    User.findOne({ accessToken: req.params.accessToken }, function (err, user) {
        if (err) {
            console.log('Error in finding user', err);
            return;
        }
        if (user.isTokenValid) {
            if (req.body.newPass == req.body.confirmPass) {
                user.password = req.body.newPass;
                user.isTokenValid = false;
                user.save();
                req.flash('success', "Password updated. Login now!");
                return res.redirect('/users/sign-in');
            }
            else {
                req.flash('error', "Passwords don't match");
                return res.redirect('back');
            }
        }
        else {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    });
};