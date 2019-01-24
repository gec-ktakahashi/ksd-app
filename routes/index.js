const express = require('express');
const sequelize = require('sequelize');
const webclient = require("request");
var router = express.Router();



/* GET home page. */
router.get('/', function (req, res) {
  console.log(req.option);

  res.render('index', {
    title: 'Express'
  });

});

module.exports = router;