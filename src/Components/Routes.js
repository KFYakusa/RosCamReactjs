

import React from 'react'
import { Router, Switch,Route } from 'react-router'
import Register from '../Pages/register';
import Login from '../Pages/login';
import Home from '../Pages/home';
import { history } from '../history';
import NotFound from '../Pages/notFound';
import PrivateRoute from './PrivateRoute';


const Routes = () =>(
    <Router history={history}>
        <Switch>
            <Route path="/" component={Home} exact  />
            <Route path="/Login" component={Login} exact/>
            <Route path="/Register" component={Register} exact />
            <Route path="*" component={NotFound}  />
        </Switch>
    </Router>
)
export default Routes