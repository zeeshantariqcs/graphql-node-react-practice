const express = require('express');
const router = express.Router();

const utility = require('../functions/utility.js');
const Config = require('../config/config');
const config = new Config();
const authenticate_user = require('../functions/authenticate_user');


/** Models, Controllers and Services Includes **/
const User = require('../models/user');
const UserController = require('../controllers/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.post('/device-token', authenticate_user(), function (req, res, next) {
    UserController.saveDeviceToken(req, function (err, response) {
        return res.json(response);
    });
});


/***
 * @Purpose:
 */
router.post('/forgot-password', async (req, res, next) => {
    UserController.sendForgotPasswordEmail(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * @Purpose: Vendor Authenticate API
 */
router.post('/authenticate', async (req, res, next) => {
    UserController.authenticateUser(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * @Purpose: Guest User API
 */
router.post('/guest-user-auth', async (req, res, next) => {
    UserController.guestUserAuth(req, function (err, response) {
        return res.json(response);
    });
});


/*
Post Password RESET Request Handler.
*
*/
router.post('/reset-password', async (req, res) => {
    UserController.resetPassword(req, function (err, response) {
        return res.json(response);
    });
});


/* Post Change Password Request Handler.
*
*/
router.post('/change-password', authenticate_user(), async (req, res) => {
    UserController.changePassword(req, function (err, response) {
        return res.json(response);
    });
});



module.exports = router;
