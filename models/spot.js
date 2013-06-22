var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var spotSchema = new Schema({
    owner: String,
    open: Boolean,
   	address: String,
    city: String,
    state: String,
    zip: String,
    lat: Number,
    lng: Number,
    max: Number,
    wifi: Boolean,
    bathroom: Boolean,
    shower: Boolean,
    tent: Boolean,
    water: Boolean,
    waste: Boolean
}, { collection: 'Spot' });


module.exports = mongoose.model('Spot', spotSchema, 'Spot');
