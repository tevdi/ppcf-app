import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import history from './history'
import ShowData from './ShowData'
import ShowElement from './ShowElement'
import AddElement from './AddElement'

require('./css/App.scss')

const basename = process.env.ROUTER_BASENAME || '/'

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <header>
        <h1>PPCF</h1>
        </header>
        <div>
          <Router history={ history } basename={ basename }>
            <Switch>
              <Route path="/add-element/:id?" component={AddElement}>
              </Route>
              <Route path="/element/:id" component={ShowElement}>
              </Route>
              <Route path="/">
                <ShowData/>
              </Route>
            </Switch>
          </Router>
        </div>
      </React.Fragment>
    )
  }
}

export default App
