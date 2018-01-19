import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
//import Footer from '../../components/Footer/';

import History from '../../views/Dashboard/History';
import Behaviour from '../../views/Dashboard/Behaviour';
import Structure from '../../views/Dashboard/Structure';

class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/history" name="History" component={History}/>
                <Route path="/behaviour" name="Behaviour" component={Behaviour}/>
                <Route path="/structure" name="Structure" component={Structure}/>
                <Redirect from="/" to="/history"/>
              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
      </div>
    );
  }
}

export default Full;
