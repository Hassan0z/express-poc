var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');
var React = require("react"),
    myComponent =require("../HelloComponent"),
    ReactComponent = React.createFactory(myComponent);
var ReactDOMServer = require('react-dom/server');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("SENDING REQUEST");
	request.post({
	  headers: {'content-type' : 'application/json'},
	  url: 'https://cig-prod-api.azurewebsites.net/api/matches/schedules',
	  body: {date: null, pageno:0, state:3, type:0},
	  json: true,
	  headers: {
	    'Authorization': 'Token HHiQLYvZnkGqfD5xzxr/Sw'
	  }
	}, function(error, response, body) {
		var reactComponentMarkup = ReactComponent(),
        staticMarkup = ReactDOMServer.renderToStaticMarkup(reactComponentMarkup);

		var matches = response.body;
		var uniqMatches = _.uniqBy(matches, 'md');
        var upcomingMatches = _.map(uniqMatches, function(match, index) {
            let resultObj = {date: '', matches: []};
            resultObj.date = match.md;
            resultObj.matches = _.filter(matches, {md: match.md});
            return resultObj;
        });
        res.render('index', { title: 'Express', upcomingMatches: upcomingMatches, message: ':)', helloComponentMarkup: staticMarkup });
	});
});

module.exports = router;
