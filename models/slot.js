const mongoose = require('mongoose');
const Config = require('../config/config');
const config = new Config();


const slotSchema = mongoose.Schema({
    hall_id: {type: String, required: true},
    date: {
        type: Date,
        required: true
    },
    yearMonth: {type: String, required: true},
    schedule: [{
        slot: String, status: {
            type: String,
            default: "available",
            enum: ["available", "booked", "temporarily-booked", "not-available"]
        }
    }],
    createdAt:
        {
            type: Date,
            default:
            Date.now
        }
});

// Compile model from schema

var Slot = mongoose.model('Slot', slotSchema);
var exports = module.exports = Slot;



