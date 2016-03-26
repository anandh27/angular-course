var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/waitandeat';

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

  var data = {name:  req.body.name,
              phone: req.body.phone,
              size:  req.body.size};

  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // SQL Query > Insert Data
    client.query("INSERT INTO parties(name, phone, size) values($1, $2, $3)", [data.name, data.phone, data.size]);

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
