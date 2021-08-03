

import React from 'react'
import { Router, Switch,Route } from 'react-router'
import Register from '../Pages/register';
import Login from '../Pages/login';
import Home from '../Pages/home';
// import { history } from '../history';
import NotFound from '../Pages/notFound';
import PrivateRoute from './PrivateRoute';


const Routes = () =>(
    
        <Switch>
            <Route exact path="/" component={Home}   />
            <Route exact path="/Login" component={Login} />
            <Route exact path="/Register" component={Register}  />
            <Route exact path="*" component={NotFound}  />
        </Switch>
    
)
export default Routes