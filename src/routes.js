import React from 'react';
import {
	Route, IndexRoute
}
from 'react-router';

import Framework from './components/Framework.react'
import Dashboard from './components/Dashboard'
import About from './components/About'
import Player from './components/Player'

export
default (
	<Route path="/" component={Framework}>

      <IndexRoute component={Dashboard}/>
      <Route path="about" component={About} />      
      <Route path="player" component={Player} />   
    </Route>
)