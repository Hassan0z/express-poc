var React = require("react");
var createReactClass = require('create-react-class');

var HelloComponent = createReactClass({
    render:function(){
        return React.createElement('h3', null, 'I am rendering react component !!');
    }
});
module.exports = HelloComponent;
