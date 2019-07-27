var mongoose = require('mongoose');
//connect the db
mongoose.connect('mongodb://localhost/ilearn');

var  ClassSchema = mongoose.Schema({
	title:{
		type:String
	},
	description:{
		type:String
	},
	instructor:{
		type: String
	},
	lessons:[{
		lesson_number:{type:Number},
		lesson_title:{type:String},
		lesson_body:{type:String},
		Add_date:{type:String}
	}],
	Date:{
		type:String
	},
	image:{
		type:String
	},
	fees:{
		type:Number
	},
	duration:{
		type:String
	},
	Num_Students:{
		type:Number
	},
	total:{
		type:Number
	},
	period:{
		type:String
	},
	start:{
		type:String
	}


});

//classes is the name of the collection on the DB 
var Class = module.exports = mongoose.model('classes',ClassSchema);


//fetch all the classes
module.exports.getClasses = function(callback,limit){
	Class.find(callback).limit(limit);
}


//fetch single Class
module.exports.getClassById = function(id,callback){
	Class.findById(id,callback);
}


//Add Lesson
//info --->create an info object and pass it 
module.exports.addLesson = function(info,callback){
	class_id = info['class_id'];
	lesson_number = info['lesson_number'];
	lesson_title = info['lesson_title'];
	lesson_body = info['lesson_body'];
	Add_date = info['Add_date'];

	//first:the id
	//push the object of objects
	//pass some options :upsert: bool - creates the object if it doesn't exist. defaults to false.
	//call back
	Class.findByIdAndUpdate(
		class_id,
		{$push:{"lessons":{lesson_number:lesson_number,lesson_title:lesson_title,lesson_body:lesson_body,Add_date:Add_date}}},
		{safe:true,upsert:true},
		callback
		);
}

//return the number of the whole classes
module.exports.getClassnum = function(callback){
	Class.count({},function(err,count){
		if (err) throw err;
		console.log('there are %d jungle adventures', count);
	});
}


module.exports.increasestudent = function(id,callback){
	//first:the id
	//push the object of objects
	//pass some options :upsert: bool - creates the object if it doesn't exist. defaults to false.
	//call back
	Class.findByIdAndUpdate(
		id,
		{$inc:{Num_Students:1}},
		{safe:true,upsert:true},
		callback
		);
}


module.exports.decreasestudent = function(id,callback){
	//first:the id
	//push the object of objects
	//pass some options :upsert: bool - creates the object if it doesn't exist. defaults to false.
	//call back
	Class.findByIdAndUpdate(
		id,
		{$inc:{Num_Students:-1}},
		{safe:true,upsert:true},
		callback
		);
}


module.exports.saveClass = function(newClass,callback){
//hash the user password 
		//if(err) throw err;
		//use this function to save newuser and newstudent samitounsly to both data  
		newClass.save(callback);
	
}

