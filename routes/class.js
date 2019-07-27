var express = require('express');
var router =express.Router();



var Class = require('../modles/class');



//get the whole classes get 

router.get('/',function(req,res,next){
	Class.getClasses(function(err,classes){
		if (err) throw err;

		res.render('class/showall',{classes:classes,title:"Our courses"});

	},1000);
});

// Class Details
router.get('/:id/detailes', function(req, res, next) {
	Class.getClassById([req.params.id],function(err, classname){
		if(err) throw err;
		console.log(classname);
		res.render('class/detailes', { classname: classname  });
	});
});

// Get Lesson
router.get('/:id/lessons/:lesson_id', function(req, res, next) {
	Class.getClassById([req.params.id],function(err, classname){
		var lesson;
		//console.log([req.params.id]);
		//console.log(classname);
		if(err) throw err;
		for(i=0;i<classname.lessons.length;i++){
			if(classname.lessons[i]._id == req.params.lesson_id){
				lesson = classname.lessons[i];
			}
		}
		console.log(lesson);
		res.render('class/lesson', { classname: classname,lesson: lesson });
	});
});


module.exports = router;