var React = require("react");
var createReactClass = require('create-react-class');
var articleTextHelper = require('./helpers/article-text-helper');

var HelloComponent = createReactClass({
    render:function(){
        return React.createElement('div', null, articleTextHelper('{{text Cricket and Showbiz have always been going side by side with each other. The entertainment industries of both India and Pakistan has been largely connected to the cricketers across the globe. }}'));
    }
});
module.exports = HelloComponent;

// var React = require("react");
// var createReactClass = require('create-react-class');

// var HelloComponent = createReactClass({
//     render:function(){
//         return (
//         	<div></div>
//         );
//     }
// });
// module.exports = HelloComponent;