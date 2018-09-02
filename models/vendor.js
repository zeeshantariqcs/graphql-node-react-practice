'use strict';
const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const vendorSchema = Schema({
        user_email: {
            type: String,
            lowercase: true,
            trim: true},
        name: String
    });
// Compile model from schema
module.exports = mongoose.model('Vendor', vendorSchema);
