var express = require('express');
var router = express.Router();

let journeyModel = require('../models/connection');
let userModel = require('../models/users');

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.myTickets = [];
  req.session.user = null;
  res.render('login');
});

router.get('/homepage', function(req, res, next) {
  res.render('homepage');
});



// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});

// Route qui s'active quand on choisit 2 villes et une date
router.post('/find-way', async function(req, res){
  console.log(req.body.dateFromFront);
  console.log(req.body.fromCityFromFront);
  console.log(req.body.toCityFromFront);

  let departure = req.body.fromCityFromFront;
  let arrival = req.body.toCityFromFront;
  let date = req.body.dateFromFront;

  let findJourney = await journeyModel.find({departure: departure, arrival: arrival, date: date});
  console.log(findJourney);
  if(findJourney.length < 1){
    
    res.redirect('/not-found');
  } else {
    console.log(findJourney[0]._id);
    res.render('found', {findJourney});
  }
});

// Si la recherche n'a rien donné
router.get('/not-found', function(req, res, next){
  res.render('notFound');
});


// Route qui s'active quand on choisi un trajet et renvoi à la liste de nos trajet
router.get('/my-ticket', function(req, res, next){
  console.log(req.query.id)
  let journeyId = req.query.id;
  req.session.myTickets.push(journeyId);
  res.render('myTickets', {tickets: req.session.myTickets});
});




router.get('/confirm', async function(req, res, next){
  for(let i=0; i<req.session.myTickets.length; i++){
    await userModel.updateOne(
      {_id: req.session.user.id},
      { $push: {journeys: req.session.myTickets[i]} }
    );
  }
  res.redirect('/myLastTrips');
});


router.get('/myLastTrips', async function(req, res, next){
  let lastTrips = [];
  console.log(req.session.user.id);
  let user = await userModel.findById(req.session.user.id);
  console.log(user);
  lastTrips = user.journeys;
  res.render('lastTrips', {lastTrips});
});

module.exports = router;
