var mongoose = require('mongoose');
//connect the db
mongoose.connect('mongodb://localhost/ilearn');


var StudentSchema = mongoose.Schema({
	title: {
		type: String
	},
	total_grades: {
		type: Number
	},
	
	//hold the username from the user schema
	Add_time: {
		type: String

	},
	AddBy: {
		type: String
	},

	class_id:{type: [mongoose.Schema.Types.ObjectId]},	
	//hold the classes which the student register for 
	//classes with the (object id type)
	//add also the class title to find the classes g
	//that the student register for with 
	questions:[{
		question:{type:String},
		options:[{type: String}],
		correct: {type:String},
		points:{type:Number}
	}]		
});

var Quiz = module.exports = mongoose.model('Quiz',StudentSchema);


module.exports.saveQuiz = function(newQuiz,callback){
//hash the user password 

		if(err) throw err;
		// Set hash to the user password
		newQuiz.save(callback);

}


module.exports.addquestion = function(newquestion,callback){
	quiz_id = newquestion['quiz_id'];
	question = newquestion['question'];
	options = newquestion['options'];
	correct = newquestion['correct'];
	points = newquestion['points'];
//	Add_date = info['Add_date'];

	//first:the id
	//push the object of objects
	//pass some options :upsert: bool - creates the object if it doesn't exist. defaults to false.
	//call back
	Quiz.findByIdAndUpdate(
		quiz_id,
		{$push:{"questions":{options:options,correct:correct,points:points}}},
		{safe:true,upsert:true},
		callback
		);
}


