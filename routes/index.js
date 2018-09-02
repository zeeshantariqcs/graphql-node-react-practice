const express = require('express');
const router = express.Router();

/** Models, Controllers and Services Includes **/
// const User = require('../models/user');
// const UserController = require('../controllers/users');

/** Models, Controllers and Services Includes **/


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'PAK-EVENTS APP'});
});


router.get('/test-push-notification', function (req, res, next) {
    const Notifications = require('../services/push_notifications');
    Notifications.sendNotification("");
    res.render('index', {title: 'PAK-EVENTS APP'});
    // sendNotification
});


module.exports = router;
