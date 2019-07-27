var mongoose = require('mongoose');
//connect the db
mongoose.connect('mongodb://localhost/ilearn');


var StudentSchema = mongoose.Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	//an object to hold all the adress deatalies
	//(street/city/state/zip)
	address: [{
		street_address:{type: String},
		city:{type: String},
		state:{type: String},
		zip:{type: String},
		country:{type:String}
	}],
	//hold the username from the user schema
	username: {
		type: String
	},
	email: {
		type: String
	},
	//hold the classes which the student register for 
	//classes with the (object id type)
	//add also the class title to find the classes g
	//that the student register for with 
	classes:[{
		class_id:{type: [mongoose.Schema.Types.ObjectId]},
		class_title: {type:String}
	}]		
});

var Student = module.exports = mongoose.model('Student',StudentSchema);

module.exports.getStudentByUsername = function(username,callback){
	var query = {username:username};
	Student.findOne(query,callback);
}


// Register Student for Class
// the function takes 2 arguments the object contains
// student name,class id,class title
// this function is used for rigester the student top the class
module.exports.register = function(info, callback) {
    student_username = info['student_username'];
    class_id = info['class_id'];
    class_title = info['class_title'];


    var query = {username: student_username};
   	// find the student by his name and push him class id and title
    Student.findOneAndUpdate(
      query,
      {$push: {"classes": {class_id: class_id, class_title: class_title}}},
      {safe: true, upsert: true},
      callback
    );
}


// Register Student for Class
// the function takes 2 arguments the object contains
// student name,class id,class title
// this function is used for rigester the student top the class
module.exports.unregister = function(info, callback) {
    student_username = info['student_username'];
    class_id = info['class_id'];
    class_title = info['class_title'];


    var query = {username: student_username};
   	// find the student by his name and push him class id and title
    Student.findOneAndUpdate(
      query,
      {$pull: {"classes": {class_id: class_id, class_title: class_title}}},
      {safe: true, upsert: true},
      callback
    );
}






