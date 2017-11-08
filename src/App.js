import React, { Component } from 'react';
import HeaderButton from './header/header.js';
import MatchDetails from './header/match-details/match-details.js';
import BookMarks from './header/bookmarks/bookmarks.js';
import Friends from './header/friends/friends.js';
import Notifications from './header/notifications/notifications.js';
import Trending from './header/trending/trending.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };
  }

  render() {
    return (
      <div>
        <div className="icon-menu-bar">
            <HeaderButton onClick={() => this.handleClick(0)} name="Match" icon="MT" />
            <HeaderButton onClick={() => this.handleClick(1)} name="Bookmark" icon="BM" />
            <HeaderButton onClick={() => this.handleClick(2)} name="Notifications" icon="NT" />
            <HeaderButton onClick={() => this.handleClick(3)} name="Friends" icon="FD" />
            <HeaderButton onClick={() => this.handleClick(4)} name="Trending" icon="TD" />
        </div>
        <div>
          {this.state.selected === 0 && <MatchDetails/>}
          {this.state.selected === 1 && <BookMarks/>}
          {this.state.selected === 2 && <Notifications/>}
          {this.state.selected === 3 && <Friends/>}
          {this.state.selected === 4 && <Trending/>}
        </div>
      </div>
    );
  }

  handleClick(i) {
    this.setState({selected: i});
  }
}

export default App;
