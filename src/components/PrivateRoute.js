/*Prevents users from accessing content while they're not logged in*/

import React, { useContext } from 'react'
import { Route, Redirect } from "react-router-dom"
import {useAuth} from "../contexts/AuthContext"



export default function PrivateRoute({component: Component, ...rest}) {

    const { currentUser } = useAuth()

    return (
        <Route {...rest} render={props => {
            
            /*Needs to be expalined in more detail*/

           return  currentUser ? <Component {...props}/> : <Redirect to ="/login"/>

        }}>

        </Route>
    )
}

 