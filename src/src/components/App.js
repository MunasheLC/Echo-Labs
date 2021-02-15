import React from 'react'
import Signup from "./Signup"
import {Container} from 'react-bootstrap'
import './App.css'
import { AuthProvider } from '../contexts/AuthContext'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import ForgotPassword from "./ForgotPassword"
import PrivateRoute from "./PrivateRoute"
import UpdateProfile from "./UpdateProfile"




function App() {
  return (
    <Container>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard}/>
              <PrivateRoute path="/update-profile" component={UpdateProfile}/>
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </Router>
    </Container>
  );
}

export default App;
