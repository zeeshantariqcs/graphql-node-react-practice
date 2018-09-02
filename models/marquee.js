const mongoose = require('mongoose');
const Config = require('../config/config');
const config = new Config();
const default_image = [{
    'media_id': '5a1f9ffe086c043da9088338',
    'path': config.images_url + 'default_venue.png'
}];


const marqueeSchema = mongoose.Schema({
    name: String,
    contact_number: String,
    images: {
        type: [], default: default_image
    },
    location: {type: [Number], index: '2d', default: [73.0567610, 33.6617120]}, // [<longitude>, <latitude>]
    locationText: {
        type: String,
        default: "I-9/3 I-9, Islamabad, Islamabad Capital Territory, Pakistan"
    },
    category: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default:
            true
    },
    createdAt:
        {
            type: Date,
            default:
            Date.now
        },
    createdBy: String
});

// Compile model from schema

var Marquee = mongoose.model('Marquee', marqueeSchema);
var exports = module.exports = Marquee;



