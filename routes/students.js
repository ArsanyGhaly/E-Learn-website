var express = require('express');
var router = express.Router();

Class = require('../modles/class');
Student= require('../modles/student');
User = require('../modles/user');


router.get('/classes', function(req, res, next){
	Student.getStudentByUsername(req.user.username, function(err, student){
		if(err) throw err;
		
		res.render('student/classes', {student: student});
		console.log(student);
	});
});

router.post('/register', function(req, res){
	info = [];
	info['student_username'] = req.user.username;
	info['class_id'] = req.body.class_id;
	info['class_title'] = req.body.class_title;


//	Student.getStudentByUsername([req.user.username],function(username,student){
//		if(err) throw err;
//		for(i=0;i<student.classes.length;i++){
//			if(classname.lessons[i].class_id == req.body.class_id){
//	        req.flash('error', 'You are already registered to this class before');
//	        res.redirect('/students/classes');
//	        break;
//			}
//		}
//	});


	Student.register(info, function(err, student){
		if(err) throw err;
		console.log(student);
	});
	Class.increasestudent(req.body.class_id,function(err, student_number){
		if(err) throw err;
		console.log(student_number);
	});
	req.flash('success_msg', 'You are now registered to teach this class');
	res.redirect('/students/classes');
});


router.post('/unregister', function(req, res){
	info = [];
	info['student_username'] = req.user.username;
	info['class_id'] = req.body.class_id;
	info['class_title'] = req.body.class_title;

	Student.unregister(info, function(err, student){
		if(err) throw err;
		console.log(student);
	});
	Class.decreasestudent(req.body.class_id,function(err, student_number){
		if(err) throw err;
		console.log(student_number);
	});
	req.flash('success', 'You are now unregistered to teach this class');
	res.redirect('/students/classes');
});

router.get('/classes/:id/lessons/add', function(req, res, next){
	res.render('/class/addlesson',{class_id:req.params.id});
});


// Class Details
router.get('/:id/detailes', function(req, res, next) {
	console.log(req.params.id);
	Class.getClassById(req.params.id,function(err, classname){
		if(err) throw err;
		console.log(classname);
		res.render('student/detailes', { classname: classname  });
	});
});


/*
router.post('/classes/:id/lessons/new', function(req, res, next){
	// Get Values
	var info = [];
	info['class_id'] = req.params.id;
	info['lesson_number'] = req.body.lesson_number;
	info['lesson_title'] = req.body.lesson_title;
	info['lesson_body'] = req.body.lesson_body;
	info['Add_date'] = Date.now();

	Class.addLesson(info, function(err, lesson){
		console.log('Lesson Added..');
	});

	req.flash('success_msg','Lesson Added');
	res.redirect('/class/classes');
});

*/


module.exports = router;