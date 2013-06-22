var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var userSchema = new Schema({
    userId: String,
    accessToken : String,
   	displayName: String,
   	photo: String,
   	vehicle: String,
   	city: String,
   	state: String,
   	zip: String,
   	rating: Array,
   	lat: Number,
   	lng: Number,
   	date: Date
}, { collection: 'User' });


module.exports = mongoose.model('User', userSchema, 'User');
