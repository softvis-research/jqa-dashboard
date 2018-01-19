import React, { Component } from 'react';

import {render} from 'react-dom';
import {ResponsivePie, ResponsiveBar} from 'nivo';

import DashboardAbstract, { neo4jSession } from './Abstract';

class Behaviour extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
      super.componentDidMount();
    }

    render() {
        return (
          <div>
            <div style={{height:"600px"}}>
              <h2>currently empty</h2>
            </div>
          </div>
        )
    }
}

export default Behaviour;
