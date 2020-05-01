var express = require('express');
var router = express.Router();
let userModel = require('../models/users');

/* GET users listing. */
router.post('/sign-up', async function(req, res){
  let searchEmail = await userModel.findOne({email: req.body.emailFromFront});

  if(searchEmail){
    console.log(searchEmail);
    res.redirect('/');
  } else {
    let newUser = new userModel({
      firstName: req.body.FirstNameFromFront,
      lastName: req.body.NameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront
    });
    let newUserSave = await newUser.save();
    req.session.user = {id: newUserSave._id, name: newUserSave.firstName};
    req.session.myTickets = [];
    res.redirect('/homepage');
  } 
});

router.post('/sign-in', async function(req, res){
  let searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  });

  if(!searchUser){
    console.log('Connection impossible');
    res.redirect('/');
  } else {
    console.log("Bienvenue " + searchUser.firstName);
    req.session.user = {id: searchUser._id, name: searchUser.firstName};
    req.session.myTickets = [];
    console.log("Connecté")
    res.redirect('/homepage');

  }
});

router.get('/logout', function(req, res, next){
  req.session.user = null;
  req.session.myTickets = null;
  res.redirect('/')
})


module.exports = router;
