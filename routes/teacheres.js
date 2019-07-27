var express = require('express');
var router = express.Router();


//multer to upload the images
var multer = require('multer');
var upload = multer({dest: './public/images/up'});

Class = require('../modles/class');
Teacher= require('../modles/teacher');
User = require('../modles/user');


router.get('/classes', function(req, res, next){
	Teacher.getTeacherByUsername(req.user.username, function(err, teacher){
		if(err) throw err;
		res.render('teacher/classes', {teacher: teacher});
		console.log(teacher);
	});
});

router.post('/register', function(req, res){
	info = [];
	info['teacher_username'] = req.user.username;
	info['class_id'] = req.body.class_id;
	info['class_title'] = req.body.class_title;

	Teacher.register(info, function(err, teacher){
		if(err) throw err;
		console.log(teacher);
	});

	req.flash('success', 'You are now registered to teach this class');
	res.redirect('/teachers/classes');
});

// Class Details
router.get('/:id/detailes', function(req, res, next) {
	console.log(req.params.id);
	Class.getClassById(req.params.id,function(err, classname){
		if(err) throw err;
		console.log(classname);
		res.render('teacher/detailes', { classname: classname  });
	});
});


router.get('/classes/:id/quizes/addquiz', function(req, res, next){
	res.render('teacher/addquiz',{class_id:req.params.id,title:"Add Quiz",desc:"Add the questions"});
});



router.get('/classes/:id/lessons/add', function(req, res, next){
	res.render('teacher/addlesson',{class_id:req.params.id});
});

router.post('/classes/:id/lessons/add', function(req, res, next){
	// Get Values
	var info = [];
	info['class_id'] = req.params.id;
	info['lesson_number'] = req.body.lesson_number;
	info['lesson_title'] = req.body.lesson_title;
	info['lesson_body'] = req.body.lesson_body;
	info['Add_date'] = new Date();

	var id =req.params.id;
	Class.addLesson(info, function(err, lesson){
		console.log('Lesson Added..');
	});

	req.flash('success','Lesson Added');
	res.redirect('/teachers/'+ id +'/detailes');
});

//------------------------------------------------------
router.get('/addclass', function(req, res, next){
	res.render('./class/addclass',{title:"Add new Class",desc:"Add new class to our classes Database"});
});


router.post('/addclass',upload.single('profileimage'),function(req,res,next){
var title =req.body.title;
var description = req.body.desc;
var instructor=req.user.username;
var date = new Date();
var fees =req.body.fees;
var duration=req.body.duration;
var total =req.body.num_students;
var period=req.body.period;
var start=req.body.start;
var num_students = 0;
  if(req.file){
    console.log('Uploading File...');
    var profileimage = req.file.filename;
  } else {
    console.log('No File Uploaded...');
    var profileimage = 'noimage.jpg';
  }


  // Form Validator
  req.checkBody('title','title field is required').notEmpty();
  req.checkBody('desc','description field is required').notEmpty();
  req.checkBody('fees','fees field is required').notEmpty();
  req.checkBody('duration','duration field is required').notEmpty();
  req.checkBody('period','period field is required').notEmpty();
  req.checkBody('start','start field is required').notEmpty();
  req.checkBody('num_students','num_students field is required').notEmpty();
  //req.checkBody('password','Password field is required').notEmpty();
  //req.checkBody('password2','Passwords do not match').equals(req.body.password);
 // req.checkBody('password','Password field is required').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
  
  //req.checkBody('username','Password field is required').isLength({ min: 5 })
  //req.checkBody('email','Email is not valid').isEmail();

  errors = req.validationErrors();
  console.log(errors);

  if(errors){
    res.render('./class/addclass',{title:"Add new Class",desc:"Add new class to our classes Database",errors:errors});
  }else {
  var newClass = new Class({
 		title:title,
		description:description,
		instructor:instructor,
		Date:date,
		image:profileimage,
		fees:fees,
		duration:duration,
		Num_Students:num_students,
		period:period,
		start:start
});
  Class.saveClass(newClass, function(err, user){
          console.log('New class created');
                  });
     req.flash('success', "Thanks for new class Added");
     //res.location('/');
     res.redirect('/');
}
});

router.get('/addquiz', function(req, res, next){
	
		res.render('teacher/addquiz');
	
});
module.exports = router;