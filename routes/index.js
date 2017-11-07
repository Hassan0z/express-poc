var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');
var React = require("react"),
    myComponent =require("../HelloComponent"),
    ReactComponent = React.createFactory(myComponent);
var ReactDOMServer = require('react-dom/server');
var uglifycss = require('uglifycss');
var path = require('path');
var uglified = uglifycss.processFiles(
    [ ],
    { maxLineLen: 500, expandVars: true }
);
var articleTextHelper = require('../helpers/article-text-helper');

/* GET home page. */
router.get('/', function(req, res, next) {
	request.get({
	  headers: {'content-type' : 'application/json'},
	  url: 'https://cig-prod-api.azurewebsites.net/api/articles/article/7214',
	  json: true,
	  headers: {
	    'Authorization': 'Token HHiQLYvZnkGqfD5xzxr/Sw'
	  }
	}, function(error, response, body) {
		var _articleResponse = response.body;
		var _srcString = _articleResponse.d.replace(/\n/g, ' ');
		console.log(_srcString);
		// var reactComponentMarkup = ReactComponent(),
  //       staticMarkup = ReactDOMServer.renderToStaticMarkup(reactComponentMarkup);
		res.render('index', { 
			title: _articleResponse.t, 
			seriesName: _articleResponse.ta, 
			srcString:  _srcString,
			tagsStartIndices: articleTextHelper.getIndicesOf("{{", _srcString),
			tagsEndIndices: articleTextHelper.getIndicesOf("}}", _srcString)
		});
	});

	// request.post({
	//   headers: {'content-type' : 'application/json'},
	//   url: 'https://cig-prod-api.azurewebsites.net/api/matches/schedules',
	//   body: {date: null, pageno:0, state:3, type:0},
	//   json: true,
	//   headers: {
	//     'Authorization': 'Token HHiQLYvZnkGqfD5xzxr/Sw'
	//   }
	// }, function(error, response, body) {
	// 	var reactComponentMarkup = ReactComponent(),
 //        staticMarkup = ReactDOMServer.renderToStaticMarkup(reactComponentMarkup);

	// 	var matches = response.body;
	// 	var uniqMatches = _.uniqBy(matches, 'md');
 //        var upcomingMatches = _.map(uniqMatches, function(match, index) {
 //            let resultObj = {date: '', matches: []};
 //            resultObj.date = match.md;
 //            resultObj.matches = _.filter(matches, {md: match.md});
 //            return resultObj;
 //        });
 //        res.render('index', { title: 'Express', upcomingMatches: upcomingMatches, message: ':)', 
 //        	helloComponentMarkup: staticMarkup, uglified: uglified });
	// });
});

module.exports = router;
