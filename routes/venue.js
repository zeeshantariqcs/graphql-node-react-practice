const express = require('express');
const router = express.Router();
const utility = require('../functions/utility.js');
const authenticate_user = require('../functions/authenticate_user');


/** Models, Controllers and Services Includes **/
const User = require('../models/user');
const VenueController = require('../controllers/venue');


/***
 * @Purpose: Venue Listing API
 */
router.get('/', authenticate_user(), function (req, res, next) {
    VenueController.getVenueListing(req, function (err, response) {
        return res.json(response);
    });
});


/***
 * @purpose: Get favorite adventures api endpoint
 */
router.get('/favorites', authenticate_user(), async (req, res, next) => {
    VenueController.getFavoriteVenues(req, function (err, response) {
        return res.json(response);
    });
});


router.get('/slots', authenticate_user(), async (req, res, next) => {
    VenueController.getHallMonthlySchedule(req, function (err, response) {
        return res.json(response);
    });
});

/**
 * @purpose: Get Venue By ID
 */
router.get('/:id', authenticate_user(), function (req, res, next) {
    VenueController.getVenueById(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * @Purpose: Add Venue API
 */
router.post('/', authenticate_user("vendor"), async (req, res, next) => {
    VenueController.addVenue(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * @Purpose: Update Venue API
 */
// router.put('/:id', authenticate_user("vendor"), async (req, res, next) => {
//     VenueController.updateVenue(req, function (err, response) {
//         return res.json(response);
//     });
// });

/***
 *
 * @purpose: Mark favorite and remove favorite api endpoint
 *
 */
router.post('/favorite', authenticate_user(), async (req, res, next) => {
    VenueController.favoriteAction(req, function (err, response) {
        return res.json(response);
    });
});


router.post('/slot', authenticate_user("vendor"), async (req, res, next) => {
    VenueController.saveSlotDetails(req, function (err, response) {
        return res.json(response);
    });
});




module.exports = router;
