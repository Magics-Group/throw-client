import React from 'react';
import {
	Route, IndexRoute
}
from 'react-router';

import Framework from './components/Framework.react'
import Dashboard from './components/Dashboard'
import About from './components/About'

export
default (
	<Route path="/" component={Framework}>
      <IndexRoute component={Dashboard}/>

      <Route path="about" component={About} />      
    </Route>
)