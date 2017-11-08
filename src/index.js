import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        debugger;
        ReactDOM.render(<App />, document.getElementById('match-schedule'));
        // registerServiceWorker();
    }
};
