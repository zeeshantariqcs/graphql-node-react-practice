const mongoose = require('mongoose');
const Config = require('../config/config');
const config = new Config();
const default_image = [{
    'media_id': '5a1f9ffe086c043da9088338',
    'path': config.images_url + 'default_venue.png'
}];


const hallSchema = mongoose.Schema({
    name: String,
    capacity: String,
    cost: Number,
    images: {
        type: [], default: default_image
    },
    location: {type: [Number], index: '2d', default: [73.0567610, 33.6617120]}, // [<longitude>, <latitude>]
    locationText: {
        type: String,
        default: "I-9/3 I-9, Islamabad, Islamabad Capital Territory, Pakistan"
    },
    contactNumber: {
        type: String,
        default: ""
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
    createdBy: String,
    vendorId:String,
    marquee: {}
});

// Compile model from schema

var Hall = mongoose.model('Hall', hallSchema);
var exports = module.exports = Hall;



