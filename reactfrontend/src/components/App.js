import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import AssetDisplay from './assetDisplay/assetDisplay'
import AddAssetForm from './addAssetForm/addAssetForm'
import UnauthorizedUsersDisplay from './unauthorizedUsers/unauthorizedUsers';

class App extends Component {

  render() {
    return (
      <div className="App">
          <Switch>
            <Route path='/assets/add' component={AddAssetForm} />
            <Route path='/assets' exact component={AssetDisplay} />
            <Route path='/usermanagement/unauthorized' exact component={UnauthorizedUsersDisplay} />
          </Switch>
      </div>
    );
  }
}

export default App;