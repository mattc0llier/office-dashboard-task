require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Pusher = require('pusher');


app.use(bodyParser.json());
app.use('/static', express.static('static'));
app.set('view engine', 'hbs');

//Pusher config
const pusher = new Pusher({
  appId: '970042',
  key: '0b3f37fdbb6b9a9a4177',
  secret: process.env.PUSHER_SECRET,
  cluster: 'eu',
  encrypted: true
}); 

// mock data
const storage = {
  kpis : [{
    id: 1,
    title:'Concurrent visitors', 
    data: 456
  }, {
    id: 2,
    title:'Office temperature', 
    data: {
      currentTemperature: 19,
      targetTemperature: 22
    }
  }, {
    id: 3,
    title:'Next plant watering', 
    data: {
      nextWaterDate: '2020-03-30'
    }
  }, {
    id: 4,
    title:'Outside weather', 
    data: {
      temperature: 18,
      weather: "Sunny"
    }
  }, {
    id: 5,
    title:'Drinks left', 
    data: {
      lastDrinksOrder: 300,
      drinksRemaining: 12
    }
  }, {
    id: 6,
    title:'Who is WFH today?', 
    data: [
      {
        id: 1,
        name: 'James',
        picture: 'https://pbs.twimg.com/profile_images/798877173985771520/DVWkhX8z_400x400.jpg',
        status: 'WFH'
      }, {
        id: 2,
        name: 'Geoff',
        picture: 'https://media-exp1.licdn.com/dms/image/C5603AQH2U_X__1y6Og/profile-displayphoto-shrink_800_800/0?e=1590624000&v=beta&t=U7kktkN1iPQLnJ75ZvbZn_tHPQ68bFvOqa13gGXRN1Q',
        status: 'Office'
      }, {
        id: 3,
        name: 'JT',
        picture: 'https://pbs.twimg.com/profile_images/1532668007/team_jt_01_400x400.jpg',
        status: 'WFH'
      }
    ]
  }
]}

// create random number for concurrent users on server start
const concurrentUsers = () => {
  setInterval(function(){   
    //send live concurrent users to client
    pusher.trigger('dashboard-client', 'live-concurrent-users', {
      "totalUsers": Math.floor((Math.random()*1500)+1000)
    });
  }, 2000); 
}
//run concurrent users mock on starting server
concurrentUsers();


// get all KPIs initial state
function getKpis(){
  return storage.kpis;
}

// all kpis get endpoint
app.get('/api/kpis', function(req, res){
  const kpis = getKpis();
  res.json(kpis);
});


// index route
app.get('/', function(req, res){
  res.render('index');
});

const port = process.env.PORT || 8080;
app.listen( port, function(){
  console.log(`Listening on port number ${port}`);
});