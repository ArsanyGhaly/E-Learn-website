//require for creating the modul
var mongoose = require('mongoose');
//`require for increapt the password
var bcrypt = require('bcryptjs');

//connect the db
mongoose.connect('mongodb://localhost/ilearn');
//connect the db
//mongoose.connect('mongodb://localhost/nodeauth');
var async = require('async');
//var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		
	},
	password: {
		type: String,
		bcrypt: true
	},
	email: {
		type: String
	},
	active:{
		type:Boolean
	},
	secretToken:{
		type: String
	},
	registration_date:{
		type:Date
	},
	last_active:{
		type:Date
	},
	type:{
		type:String
	},
	profileimage:{
		type:String
	}

});

//export the schema
var User = module.exports = mongoose.model('User', UserSchema);

//creates some functions related to the user operations 
//find the user by its id (using the User as refrences) 
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

//find the user by the username (using User as refrence) 
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}

module.exports.getUserByToken = function(secretToken, callback){
	var query = {secretToken: secretToken};
	User.findOne(query, callback);
}



//compare the passwords for login purpose
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
}
/*
//create new user for sign up 
module.exports.createStudent = function(newUser, callback){
	//incrypt the password first 
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(newUser.password, salt, function(err, hash) {
   			//set the user pass to the hash one
   			newUser.password = hash;
   			//save the user to the db
   			newUser.save(callback);
    	});
	});
}
*/


module.exports.saveStudent = function(newUser,newStudent,callback){
//hash the user password 
bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;
		// Set hash to the user password
		newUser.password = hash;
		console.log('Student is being saved');

		//use this function to save newuser and newstudent samitounsly to both data  
		async.parallel(newUser.save(callback), newStudent.save(callback));
	});	
}


module.exports.saveTeacher = function(newUser,newTeacher,callback){
//hash the user password 
bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;
		// Set hash to the user password
		newUser.password = hash;
		console.log('Teacher is being saved');

		//use this function to save newuser and newstudent samitounsly to both data  
		async.parallel(newUser.save(callback), newTeacher.save(callback));
	});	
}

