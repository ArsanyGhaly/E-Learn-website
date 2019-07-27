var express = require('express');
var router = express.Router();
var Class = require('../modles/class');
var Teacher = require('../modles/teacher');
/* GET home page. */
router.get('/', function(req, res, next) {
	var tea;
	var cls;
	 	Teacher.getTeacher(function(err,teacher){
		if (err) {throw err;}
		tea = teacher;
	},3);


  	Class.getClasses(function(err,classes){
  		console.log(classes);
		if (err) {throw err;}
		cls= classes;
	},3);
res.render('index',{classes:cls,teacher:tea});
});

module.exports = router;
