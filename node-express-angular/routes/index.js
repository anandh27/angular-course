var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var twilio = require('twilio');


var twilioAccountSID = 'AC1b698743da69d39a41e2e1edb49d40e8';
var twilioAuthToken = 'c6974858a5a9a81f74c1a4d09f786f1e';
var twilioNumber = '+12248580751';

var connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/waitandeat';
var twilioClient = twilio(twilioAccountSID, twilioAuthToken);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{});
});

/* GET all parties */
router.get('/api/v1/parties', function(req, res) {
  var results = [];

  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // SQL Query > Select Data
    var query = client.query("SELECT * FROM parties ORDER BY id ASC;");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });

  });
});

router.post('/api/v1/parties', function(req, res) {
  var results = [];

  var data = {name:     req.body.name,
              phone:    req.body.phone,
              size:     req.body.size,
              done:     false,
              notified: false};

  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // SQL Query > Insert Data
    client.query("INSERT INTO parties(name, phone, size, done, notified) values($1, $2, $3, $4, $5)", [data.name, data.phone, data.size, data.done, data.notified]);

    // SQL Query > Select Data
    var query = client.query("SELECT * FROM parties ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });


  });
});

router.delete('/api/v1/parties/:party_id', function(req, res) {
  var results = [];

  var id = req.params.party_id;

  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // SQL Query > Delete Data
    client.query("DELETE FROM parties WHERE id=($1)", [id]);

    // SQL Query > Select Data
    var query = client.query("SELECT * FROM parties ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

router.post('/message', function(req, res) {
  var data = {name: req.body.name,
              phone: req.body.phone,
              size: req.body.size};

  twilioClient.messages.create({
    body: 'Hi ' + data.name + "! Your table for " + data.size + " is now ready!",
    to: data.phone,
    from: twilioNumber
  }, function(err, message) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    } else {
      console.log(message);
      return res.json(message);
    }
  });

});

router.put('/api/v1/parties/:party_id/notify', function(req, res) {
  var results = [];
  var id = req.params.party_id;
  var data = {name: req.body.name,
              phone: req.body.phone,
              size: req.body.size,
              notified: true,
              done: req.body.done};

  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).send(json({ success: false, data: err}));
    }

    // SQL Query > Update Data
    client.query("UPDATE parties SET name=($1), phone=($2), size=($3), notified=($4), done=($5) WHERE id=($6)",
                 [data.name, data.phone, data.size, data.notified, data.done, id]);

    // SQL Query > Select Data
    var query = client.query("SELECT * FROM parties ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });

});

module.exports = router;
