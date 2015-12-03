//Import mongoose and bcrypt

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// alias for mongoose.Schema

var Schema = mongoose.Schema; // shortcut object

// Define user Schema

var UserSchema = new Schema ( {
	
	username: String,
	password: String,
	email: String,
	displayName: String,
	salt: String,
	provider: String, //future login ex: github
	providerId: String,
	providerData: {},
	created: Number,
	updated: Number
	
	
},
{
	collection: 'user'
});




// Hash Generate

UserSchema.methods.generateHash = function(password) {
	
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
	
};

//validating password *hash*

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
} 

module.exports = mongoose.model('User', UserSchema);