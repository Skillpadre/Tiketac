var express = require('express');
var router = express.Router();
let userModel = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  res.send('respond with a resource');
});


router.post('/sign-up', async function(req, res){
  let searchEmail = await userModel.findOne({email: req.body.email});

  if(searchEmail){
    console.log("Addresse mail déjà utilisé");
    res.redirect('/');
  } else {
    let newUser = new userModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });
    let newUserSave = await newUser.save();
    req.session.user = {id: newUserSave._id, name: newUserSave.firstName};

    console.log("ca marche");
    res.redirect('/homepage');
  } 
});

router.post('/sign-in', async function(req, res){
  let searchUser = await userModel.findOne({
    email: req.body.email,
    password: req.body.password
  });

  if(!searchUser){
    console.log('Connection impossible');
    res.redirect('/');
  } else {
    console.log("Bienvenue " + searchUser.firstName);
    req.session.user = {id: searchUser._id, name: searchUser.firstName};

    console.log("Connecté")
    res.redirect('/homepage');
  }
})


module.exports = router;
