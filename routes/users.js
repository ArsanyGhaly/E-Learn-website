//include the required modules 
var express = require('express');
var router = express.Router();

//multer to upload the images
var multer = require('multer');
var upload = multer({dest: './uploads'});

//authantication system
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//create a random token to activate the account
var randomstring = require('randomstring');
var bcrypt = require('bcryptjs');

//require the user module to work with it 
var User = require('../modles/user');
var Student = require('../modles/student');
var Teacher = require('../modles/teacher');


var mailer=require('../controler/mailer');
/* handle the gets requests to navidate */

//users main page
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//register 
router.get('/signup', function(req, res, next) {
  res.render('users/register',{title:'Register',desc:'Sign Up As student or teacher for free to enjoy our class and meet our teachers'});
});


//---------------------------------------------------
//login to active your account
router.get('/token', function(req, res, next) {
  res.render('users/varify', {title:'Activate Account',desc:'Enter the code from your email to Activate your account'});
});

router.post('/token', function(req, res){
    var token     = req.body.token;
    console.log(token);
    //token = token.trim();  
    User.getUserByToken(token, function(err, user){
    if(err) throw err;
    if(!user){
      req.flash('error',"No user found");
      res.redirect('/users/token');
      return;
    }
    user.active = true;
    user.secretToken = "";
    user.save();
    req.flash('success',"Thanks for activate your Acoount");
    res.redirect('/');
  });
    
});
//---------------------------------------------------------
//the Login System 
//handle the post for login function 
//call the authenticate function which takes 2 arguments the stragy,and an object to determine
// the failuer dist and the failer flash
//call back function in the case of the sucess with the sucess message and the sucess dist 

//set failureFlash to string it will print out the same message in each fauier
//set it to true it will take the message from each case

//login 
router.get('/login', function(req, res, next) {
  res.render('users/login', {title:'Login'});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/', failureFlash: true}),
  function(req, res,next) {
     req.flash('success', 'You are now logged in');
     var user =req.user;
     user.last_active = Date.now();
     user.save();
     
     var usertype = user.type;

     res.redirect('/' + usertype + 's/classes');
});

//define the way to get the user which is the id
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// call the function from the  modual to get the user by the id 
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


//create the login function startgy 
// define the stratgy with username and password 
//call the get user by name from the module 
//then call the compare password to compare the hashed passwords
//which taks the entered password , compared by the stored password 
passport.use(new LocalStrategy(function(username, password, done)
{
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User or Password for: ' + username});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      
      if(!isMatch){
        return done(null, false, {message:'Unknown User or Password'}); 
      } 
      else {
        if(!user.active){
          console.log('THE ACCOUNT IS NOT ACTIVE');
          //req.flash('error',"THE ACCOUNT IS NOT ACTIVE");
          return done(null, false, {message:"THE ACCOUNT IS NOT ACTIVE Check your Email"}); 

        }else{
        return done(null, user);
      }}
    
    });



  });
}
));
//----------------------------------------------------------
//forget your Password 
//1-enter Email
//2-redirect to forget token
//3-go to reset page with id 

router.get('/forgot', function(req, res, next) {
  res.render('users/forget', {title:'Forget Password',desc:'Enter your Email Adress '});
});

router.post('/forget', function(req, res, next) {
  var email     = req.body.email;
  console.log(email);
  User.getUserByEmail(email, function(err, user){
    if(err) throw err;
    if(!user){
      req.flash('error', 'No account with that email address exists.');
      return res.redirect('/users/forgot');
    }
    const secretToken = randomstring.generate();
    const SecretToken =secretToken.trim();
    console.log('secretToken',SecretToken);
    user.active = false;
    user.secretToken = SecretToken;
    user.save();
    var mailOptions = {
    from: 'Arsanyghaly <techguyinfo@gmail.com>',
    to: email,
    subject: 'Forget Password',
    text: 'You have a submission with the following details... Name: ',
    html: '<p>You have a submission with the following details...</p>'+
    '<ul><li>Name: '+SecretToken+'</li><li>Email: '+req.body.email + '</li><li>Go to: ' + 'localhost:3000/users/forgotToken' +'</li></ul>'
  };
    mailer.sendEmail(mailOptions);
    req.flash('success', 'an email has been send.');
    return res.redirect('/users/forgotToken'); 
});
 
});

router.get('/forgotToken', function(req, res, next) {
  res.render('users/forgotToken', {title:'Change Password Token',desc:'Enter your Secret Token '});
});


router.post('/forgotToken', function(req, res){
    var token     = req.body.token;

    User.getUserByToken(token, function(err, user){
    if(err) throw err;
    if(!user){
      req.flash('error',"No user found");
      res.redirect('/users/forgotToken');
      return;
    }
    user.active = true;
    user.secretToken = "";
    user.save();
    req.flash('success',"Thanks for activate your");
    res.redirect('/users/reset/'+ token + '/');
  });

    
});

//reset your password enter the new one 
router.get('/reset/:token', function(req, res, next) {
  res.render('users/reset', {title:'Change Password', token: req.params.token,desc:'Enter your new Passwords!!'});
  
});


router.post('/reset/:token', function(req, res){
  var token     = req.params.token;
  var password  = req.body.password;
  var password2 = req.body.password2;


  //req.checkBody('password','Password field is required').notEmpty();
  //req.checkBody('password2','Passwords do not match').equals(req.body.password);

   //errors = req.validationErrors();
  //console.log(errors);
  
  //if(errors){
    //res.render('users/reset', {
      //errors: errors,
      //title:'forgetpassword', 
      //token: req.params.token,
      //desc:'enter gthe token that you recevied on the email'
    //});
 // }else {

    User.getUserByToken(token, function(err, user){
    if(err) throw err;
    if(!user){
      req.flash('error',"No user found");

      res.redirect('back');
      //console.log("ERRORRR");
      return;
    }
    console.log(token);
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        //set the user pass to the hash one
        user.password = hash;
        //save the user to the db
        user.save();
      });
  });



    //user.password = password;
    user.active = true;
    user.secretToken = "";
    user.save();
    
    var mailOptions = {
    from: 'ileran  <techguyinfo@gmail.com>',
    to: user.email,
    subject: 'your password Changed',
    text: 'You have a submission with the following details... Name: ',
    html: '<p>You have a submission with the following details...</p><ul><li>Name: '
  };
    mailer.sendEmail(mailOptions);

    req.flash('success',"Thanks for activate your");
    res.redirect('/');
  });

   //} 
});

//----------------------------------------------------

router.post('/register',upload.single('profileimage'), async(req, res, next) => {
  try {

  // Get Form Values
  //get the user info from the form 
    var first           = req.body.first;
    var last            = req.body.last;
    var email           = req.body.email;
    var username        = req.body.username;
        
    var password        = req.body.password;
    var password2       = req.body.password2;
    var phone           = req.body.phone;
        
    var street_address  = req.body.address_line1;
    var city            = req.body.city;
    var zip             = req.body.zip;
    var state           = req.body.state;
    var country         = req.body.country;
        
    var type            = req.body.type;



  if(req.file){
    console.log('Uploading File...');
    var profileimage = req.file.filename;
  } else {
    console.log('No File Uploaded...');
    var profileimage = 'noimage.jpg';
  }

  // Form Validator
  req.checkBody('first','first field is required').notEmpty();
  req.checkBody('last','last field is required').notEmpty();
  req.checkBody('phone','phone field is required').notEmpty();
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('username','Username field is required').notEmpty();
  
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);
 // req.checkBody('password','Password field is required').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
  
  //req.checkBody('username','Password field is required').isLength({ min: 5 })
  req.checkBody('email','Email is not valid').isEmail();

  errors = req.validationErrors();
  
  
  if(errors){
    res.render('users/register', {
      errors: errors,
      title:'Register',desc:'Sign Up As student or teacher for free to enjoy our class and meet our teachers'
    });
  }else {
  	//check if the email is already exist 
    const preuser = await User.findOne({"email":email});
    if(preuser)
    {
        req.flash('error',"Email is already exist!!");
        return res.redirect('/users/signup');
    }
    //genrate the random string
	//add the secrete token to be asscoited with the user
	//also set 
	const secretToken = randomstring.generate();
	const SecretToken =secretToken.trim();
	console.log('secretToken',SecretToken);
	var newUser = new User({
      username: username,
      password: password,
      email: email,
      active : false,
      secretToken:secretToken,
      registration_date:Date.now(),
      last_active:Date.now(),
      profileimage: profileimage,     
      type : type
    });
 if(type == 'student'){
    console.log('Registering Student...');

    var newStudent = new Student({
        first_name: first,
        last_name: last,
        address: [{
          street_address: street_address,
          city: city,
          state: state,
          zip: zip,
          country: country
        }],
        email: email,
        username:username
      });

      User.saveStudent(newUser, newStudent, function(err, user){
        console.log('Student created');
      });
    } else {
      console.log('Registering Instructor...');
      var newTeacher = new Teacher({
        first_name: first,
        last_name: last,
        address: [{
          street_address: street_address,
          city: city,
          state: state,
          zip: zip,
          country:country

        }],
        email: email,
        username:username
      });

      
        User.saveTeacher(newUser, newTeacher, function(err, user){
          console.log('Instructor created');
                  });
    }


  var mailOptions = {
        from: 'Arsanyghaly <techguyinfo@gmail.com>',
        to: email,
        subject: 'Ilearn registration',
        text: 'You have a submission with the following details... Name: ',
        html: '<p>You have a submission with the following details...</p>' +
        '<ul><li>Name: '+ SecretToken +'</li>'
        +'go to: '+ '<li><a>localhost:3000/users/token</a></li>' +'</ul>' 
  };
   
   
     mailer.sendEmail(mailOptions);
     req.flash('success', "Thanks for User Added");
     //res.location('/');
     res.redirect('/');




  }



 } catch (error) {
        next(error);
    }

 });






// Log User Out
router.get('/logout', function(req, res){
  req.logout();
  // Success Message
  req.flash('success_msg', "You have logged out");
    res.redirect('/');
});
















module.exports = router;