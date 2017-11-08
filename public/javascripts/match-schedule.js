/** @jsx React.DOM */

(function() {
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            var createReactClass = require('create-react-class');

            var MatchSchedule = createReactClass({
                getInitialState: function() {
                  return {message: 'matches'};
                },
              
                handleClick: function() {
                    // change the state for nav bar here
                    alert(this.state.message);
                },
                
                render: function() {
                    return <h1>Hello, {this.props.name}</h1>;
                }
            });
            
            // Render an instance of MessageComponent into document.body
            MatchSchedule.render(
                MessageComponent,
                document.getElementById('match-schedule')
            );
        }
    };
})();
