const utility = require('../functions/utility.js');
const validator = require('../functions/validator.js');
const Config = require('../config/config');
const config = new Config();

/** Models and Services Includes **/
const Hall = require('../models/hall');
const Marquee = require('../models/marquee');
const User = require('../models/user');
const Slot = require('../models/slot');


/***
 * @purpose: Manipulate date
 * @param data
 * @param favorite_ids
 * @returns {*}
 */
function manipulate_listing(data, favorite_ids) {
    let manipulated_data = [];
    data.forEach(function (hall) {
        manipulated_data.push({
            _id: hall._id,
            images: hall.images,
            location: hall.location,
            locationText: hall.locationText,
            contactNumber: hall.contactNumber,
            marqueeDetails: hall.marquee,
            category: hall.category,
            isActive: hall.isActive,
            isFavorite: favorite_ids.filter(obj => {
                return obj.venue_id === hall._id
            }) !== null,
            createdAt: hall.createdAt,
            name: hall.name,
            capacity: hall.capacity,
            cost: hall.cost,
            createdBy: hall.createdBy
        });
    });
    return manipulated_data;
}


/**
 * venue.js controller
 *
 * @description: A set of functions called "actions" for managing `Venue Routes Handlers`.
 */

module.exports = {

    /***
     * @purpose: Add addVenue API
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    addVenue: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateAddVenue);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors)
                return callback(true, utility.get_fields_validation_errors_object(errors));
            else {

                //Get Marquee Details
                let marquee = await Marquee.findOne({createdBy: req.decoded_jwt.id});
                if (marquee === null)
                    return callback(true, utility.process_failed_response("Sorry, couldn't load marquee details."));

                //Normal Flow
                let hall = new Hall();
                hall.name = req.body.name;
                hall.capacity = req.body.capacity;
                hall.cost = req.body.cost;
                hall.locationText = req.body.address;
                hall.contactNumber=req.body.contact_number;
                hall.marquee = marquee;

                //Save Location
                let long = (typeof req.body.long !== "undefined" && req.body.long !== "") ? parseFloat(req.body.long) : 0.0;
                let lat = (typeof req.body.lat !== "undefined" && req.body.lat !== "") ? parseFloat(req.body.lat) : 0.0;
                hall.location = [long, lat];
                hall.createdBy = req.decoded_jwt.id;
                let saved_hall = await hall.save();
                if (saved_hall)
                    return callback(null,
                        utility.success_response(saved_hall, "Hall has been added successfully."));
                else
                    return callback(true, utility.process_failed_response("Sorry, unable to add hall."));
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][addVenue] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /****
     * @purpose: This method will save hall slot details
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    saveSlotDetails: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateSlotDetails);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors)
                return callback(true, utility.get_fields_validation_errors_object(errors));
            else {
                let hall_details = await Hall.findById(req.body.hall_id);
                //console.log(`Hall Details are ${JSON.stringify(hall_details)}`);
                //console.log(`HALL ID: ${req.body.hall_id} Hall createdBy: ${hall_details.createdBy} jwt id: ${req.decoded_jwt.id}`);
                if (hall_details === null)
                    return callback(true, utility.process_failed_response("Sorry, hall details not found."));
                else if (hall_details.createdBy == req.decoded_jwt.id) {

                    if (!utility.test_json(req.body.schedule))
                        return callback(true, utility.process_failed_response("Schedule field is not valid json."));

                    console.log("slot is this " + req.body.schedule);
                    let slot = JSON.parse(req.body.schedule);
                    console.log("slot is this " + slot);
                    console.log("slot is this " + JSON.stringify(slot));
                    //Only the creator of hall can set the schedule
                    //Expecting that we've hall_id, date details in this format: yyyy/mm/dd
                    let slot_details = await Slot.findOneAndUpdate({date: req.body.date}, {
                        hall_id: req.body.hall_id,
                        date: req.body.date,  //yyyy/mm/dd
                        yearMonth: req.body.date.substring(0, req.body.date.length - 3), //yyyy/mm
                        schedule: req.body.schedule !== null ? JSON.parse(req.body.schedule) : []  //Format like this: [{slot: "morning", status: "booked"}, {slot: "evening", status: "not-available"}]
                    }, {upsert: true});
                    //console.log(`slot details ${slot_details}`);
                    return callback(null,
                        utility.success_response({}, "Slot details has been saved successfully."));
                } else
                    return callback(true, utility.process_failed_response("Sorry, you are not the owner of hall, can not perform the action."));
            }
        }
        catch
            (error) {
            utility.log_it("[" + utility.get_t_now() + "][saveSlotDetails] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /***
     * @purpose: This method will return hall monthly schedule based on hall_id and yyyy/mm
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    getHallMonthlySchedule: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateGetSlotDetails);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors)
                return callback(true, utility.get_fields_validation_errors_object(errors));
            else {
                let slot_details = await Slot.find({hall_id: req.query.hall_id, yearMonth: req.query.date});
                if (slot_details === null)
                    return callback(null, utility.success_response({}, "Slot details not found."));
                else
                    return callback(null, utility.success_response(slot_details, "Slot details found successfully."));
            }
        }
        catch
            (error) {
            utility.log_it("[" + utility.get_t_now() + "][saveSlotDetails] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /****
     * Venue mark as favourite and remove from favourite action
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    favoriteAction: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateVenueFavourite);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors)
                return callback(true, utility.get_fields_validation_errors_object(errors));
            else {
                //Normal Flow
                let hall =await Hall.findById(req.body.venue_id, {_id: 1});
                if (typeof hall == "undefined" || hall===null)
                    return callback(true, utility.process_failed_response("Sorry, unable to find hall details."));
                let update_data = req.body.mark_favorite == 'yes' ? {$push: {"favourite_venues": {venue_id: req.body.venue_id}}} : {$pull: {"favourite_venues": {venue_id: req.body.venue_id}}};
                let updated_user = await User.findByIdAndUpdate(req.decoded_jwt.id, update_data, {
                    safe: true,
                    upsert: true,
                    new: true
                });
                if (updated_user)
                    return callback(null,
                        utility.success_response({}, req.body.mark_favorite == 'yes' ? "Hall has been marked as favorite successfully." : "Hall has been removed from favorites successfully."));
                else
                    return callback(true, utility.process_failed_response("Sorry, unable to perform favourite action."));
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][favoriteAction] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /****
     * @purpose: Get favorite venues listing
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    getFavoriteVenues:
        async (req, callback) => {
            try {
                let user = await User.findById(req.decoded_jwt.id, {favourite_venues: 1});
                if (typeof user !== "undefined" && user.favourite_venues !== null && user.favourite_venues.length > 0) {
                    let venue_ids = [];
                    user.favourite_venues.forEach(function (venue) {
                        venue_ids.push(venue.venue_id);
                    });
                    let halls = await Hall.find({
                        "_id": {"$in": venue_ids}
                    });
                    if (typeof halls !== "undefined")
                        return callback(null,
                            utility.success_response(halls, "Favorite halls listing."));
                    else
                        return callback(true, utility.process_failed_response("Sorry, unable to get favorite halls."));
                } else
                    return callback(true, utility.process_failed_response("No favorites found."));

            } catch (error) {
                utility.log_it("[" + utility.get_t_now() + "][getFavoriteVenues] Error '" + error);
                return callback(true, utility.internal_error_response(error));
            }
        },

    /***
     * @purpose: Get Guest Reservations API
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    getVenueListing:
        async (req, callback) => {
            try {
                let limit = parseInt(req.query.limit || req.body.limit || 10);
                let skip = parseInt(req.query.skip || req.body.skip || 0);
                let condition_array = [];
                //Guests Condition
                if (typeof req.query.guests !== "undefined" && req.query.guests > 0)
                    condition_array.push({
                        capacity: {
                            $gte: parseInt(req.query.guests),
                            $lte: parseInt(req.query.guests + 300)
                        }
                    });
                condition_array.push({isActive: true});
                //Nearby Location Search
                if (req.query.long != 0 && req.query.lat != 0 && req.query.long !== null && req.query.lat !== null && typeof req.query.long !== 'undefined' && req.query.long !== "" && req.query.long !== -1000 && req.query.lat !== -1000 && req.query.lat !== "null" && req.query.long !== "null" && req.query.lat !== "" && !isNaN(req.query.long) && typeof req.query.lat !== 'undefined' && !isNaN(req.query.lat !== "") && req.query.lat !== null) {
                    console.log("In Location Search");
                    // get the max distance or set it to 800 kilometers
                    let maxDistance = req.query.distance || 800;
                    console.log("Max Distance is this " + maxDistance);
                    maxDistance /= 111.12;
                    let coords = [];
                    coords[0] = parseFloat(req.query.long);
                    coords[1] = parseFloat(req.query.lat);
                    let location_cond = {
                        location: {
                            '$near': coords,
                            '$maxDistance': maxDistance
                        }
                    };
                    condition_array.push(location_cond);
                }
                condition_array.push({isActive: true});

                let condition = {
                    $and: condition_array
                };

                //Sorting Logic
                let sort_with = (typeof req.query.sort_by_location != "undefined" && req.query.sort_by_location == 1) ? {} : {createdAt: -1};
                if (typeof req.query.sort_by_capacity != "undefined" && req.query.sort_by_capacity == 1)
                    sort_with = {capacity: -1};
                if (typeof req.query.sort_by_name != "undefined" && req.query.sort_by_name == 1)
                    sort_with = {name: -1};

                console.log(`Condition is this ${JSON.stringify(condition)}`);
                let halls_count = await Hall.count(condition);
                let halls = await Hall.find(condition).sort(sort_with).skip(skip).limit(limit).exec();
                let user_details = await User.findById(req.decoded_jwt.id, {favourite_venues: 1});
                let favorites = user_details.favourite_venues !== null ? user_details.favourite_venues : [];
                return callback(null, (utility.success_response({
                    halls: (halls !== null && halls.length > 0) ? manipulate_listing(halls, favorites) : [],
                    total_count: halls_count
                }, 'All halls are listed.')));
            } catch (error) {
                utility.log_it("[" + utility.get_t_now() + "][getVenueListing] Error '" + error);
                return callback(true, utility.internal_error_response(error));
            }
        },

    /****
     * @purpose: Get Venue By ID
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    getVenueById:
        async (req, callback) => {
            try {
                let hall = await Hall.findById(req.params.id);
                if (hall !== null) {
                    let user_details = await User.findById(req.decoded_jwt.id, {favourite_venues: 1});
                    let favorites = user_details.favourite_venues !== null ? user_details.favourite_venues : [];
                    return callback(null, (utility.success_response({
                        venue: {
                            _id: hall._id,
                            images: hall.images,
                            location: hall.location,
                            locationText: hall.locationText,
                            contactNumber: hall.contactNumber,
                            category: hall.category,
                            marqueeDetails: hall.marquee,
                            isActive: hall.isActive,
                            isFavorite: favorites.filter(obj => {
                                return obj.venue_id === hall._id
                            }) !== null,
                            createdAt: hall.createdAt,
                            name: hall.name,
                            capacity: hall.capacity,
                            cost: hall.cost,
                            createdBy: hall.createdBy
                        },
                    }, 'Hall Found.')));
                } else {
                    return callback(true, utility.process_failed_response("No Hall Found By Id."));
                }
            } catch (error) {
                utility.log_it("[" + utility.get_t_now() + "][getVenueById] Error '" + error);
                return callback(true, utility.internal_error_response(error));
            }
        }

};