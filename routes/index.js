var express = require('express');
var router = express.Router();
let journeyModel = require('../models/connection');

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/homepage', function(req, res, next) {
  res.render('homepage',{ title: 'Express' });
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

router.post('/find-way', async function(req, res){
  let departure = req.body.fromCityFromFront;
  let arrival = req.body.toCityFromFront;
  let date = req.body.dateFromFront;

  let findJourney = await journeyModel.find({departure: departure, arrival: arrival, date: date});
  console.log(findJourney);
  if(findJourney.length < 1){
    
    res.render('/not-found');
  } else {
    
    res.render('/found', {journeys: findJourney})
  }

  res.render('index',{ title: 'Express' });
});


router.get('/valid-ticket', async function(req, res){
  let journeyId = req.query.id;
  req.session.myTickets.push(journeyId);
});

module.exports = router;
