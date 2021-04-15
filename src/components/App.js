import React from 'react'
import Signup from "./Signup"
import {Container} from 'react-bootstrap'
import './App.css'
import { AuthProvider } from '../contexts/AuthContext'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Login from "./Login"
import Dashboard from "./Dashboard"
import ForgotPassword from "./ForgotPassword"
import PrivateRoute from "./PrivateRoute"
import UpdateProfile from "./UpdateProfile"
import UserLabRooms from "./UserLabRooms"
import CreateLabRoom from "./CreateUserLabRoom"
import join from "./Join"
import Room from "./Room"
import createRoom from "./CreateRoom"

function App() {
  return (
    <Container>
        <Router>
          <AuthProvider>
            <Switch>
<<<<<<< HEAD
              <PrivateRoute exact path="/" component={Dashboard}/>
              <PrivateRoute path="/update-profile" component={UpdateProfile}/>
              <PrivateRoute path="/user-lab-rooms" component={UserLabRooms}/>
              <PrivateRoute path="/createLabRoom" component={CreateLabRoom}/>
              <PrivateRoute path="/join" component={join}/>
              <PrivateRoute path="/create-room" component={createRoom}/>
              <PrivateRoute path="/room/:roomID" component={Room}/>
=======
              <PrivateRoute exact path="/dashboard" component={Dashboard}/>
              <PrivateRoute exact path="/update-profile" component={UpdateProfile}/>
              <PrivateRoute exact path="/user-lab-rooms" component={UserLabRooms}/>
              <PrivateRoute exact path="/createLabRoom" component={CreateLabRoom}/>
              <PrivateRoute exact path="/join" component={join}/>
>>>>>>> d2d6dd2ab919bfb64383a871a873d2d4f9ea381b
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
