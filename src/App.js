import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

//components
import Login from './components/LoginPage.js'
import HomePage from './components/mainPanel/HomePage'


function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={HomePage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
