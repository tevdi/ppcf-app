import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import history from 'newHistory';
import ShowData from 'ShowData';
import ShowElement from 'ShowElement';
import AddElement from 'AddElement';

require('./css/App.scss');

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <header>
          <h1>PPCF</h1>
        </header>
        <div>
          <Router history={history}>
            <Switch>
              <Route path={`${process.env.BASENAME}/add-element/:id?`} component={AddElement}></Route>
              <Route path={`${process.env.BASENAME}/element/:id`} component={ShowElement}></Route>
              <Route path={`${process.env.BASENAME}`}>
                <ShowData />
              </Route>
            </Switch>
          </Router>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
