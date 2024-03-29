const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
// router.get('/profile/:id/addFriend', passport.checkAuthentication, usersController.addFriend);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.post('/create', usersController.create);

//using passport as middleware to authenticate
router.post('/create-session', passport.authenticate('local', { failureRedirect: '/users/sign-in' },), usersController.createSession);

router.get('/sign-out', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: 'users/sign-in'}), usersController.createSession);

router.get('/reset-password', usersController.resetPassword);
router.post('/send-reset-pass-mail', usersController.resetPassMail);
router.get('/reset-password/:accessToken', usersController.setPassword);
router.post('/update-password/:accessToken', usersController.updatePassword); 
module.exports = router;