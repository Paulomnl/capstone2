import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useLocation
} from 'react-router-dom';
import Login from './Login';
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext"
import { Container } from "react-bootstrap"

import './css/style.scss';

import { focusHandling } from 'cruip-js-toolkit';
import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Template01 from './pages/Template01';

import Template02 from './pages/Template02';
import Template03 from './pages/Template03';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
    focusHandling('outline');
  }, [location.pathname]); // triggered on route change

  return (
    <>
     <AuthProvider>
        <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute exact path="/template01" component={Template01} />
            
            <PrivateRoute exact path="/template02" component={Template02} />
            <PrivateRoute exact path="/template03" component={Template03} />
            <Route path="/login" component={Login} />
        </Switch>
      </AuthProvider>
    </>
  );
}

export default App;
