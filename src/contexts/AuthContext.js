import React, { useContext, useState, useEffect} from 'react'
import { auth } from "../firebase"
import { db } from "../firebase"
import "firebase/auth"
import "firebase/firestore"

function updateUserInfo(){
    const currentUser = auth.currentUser;
    if (currentUser){

        const uid = currentUser.uid;
        const email = currentUser.email;
        if(uid){
        const userData = {email, lastLoginTime: new Date()};
        // console.log(userData.labs);
            // console.log("uid in authcontext: " + uid);
            return db.doc(`/users/${uid}`).set(userData, {merge:true});
        }
    }

}


/* Firebase has some more fleshed out versions of this stuff I'll try add alter*/

//Context lets us share user data across multiple components
const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    
    //This state keeps track of the current user
    const [ currentUser, setCurrentUser ] = useState() 

    // This state is used to check if a user is logged in, Set to true while looking for user
    const [loading, setLoading] = useState(true) 

    function signup ( email, password ){
        return auth.createUserWithEmailAndPassword(email, password).then(cred => {

            console.log(cred) //Logs the users credential info in console

        })
    }

    // Login Function
    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password)

    }

    //Log out function
    function logout() {
        return auth.signOut()

    }

    //Reset Password Function
    function resetPassword(email){
        return auth.sendPasswordResetEmail(email)
    }

    //Update email function
    function updateEmail(email){

       return currentUser.updateEmail(email)

    }

    //Update Password Function
    function updatePassword(password){

        return currentUser.updatePassword(password)

    }


    // Called every time comp renders 


    useEffect (() => {
        // Executes the follwoing 
        //ComponentDidMount - Called the first time a comp is mounted
        // ComponentDidupdate - Called when comp is updated ( When a comp gets new props or the state changes)
        const unsubscribe = auth.onAuthStateChanged(user => {  
            console.log(user)
            setCurrentUser(user)
            setLoading(false)
            updateUserInfo()
            
        })

        
        return unsubscribe //ComponentWillUnmount - Clean up code returns unsubscribe
        

    }, []) // List Effect hook dependencies in the array, empty array means hook is only called one time

    console.log(loading) // Check loading status of user

    const value = {
        currentUser, 
        signup, 
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
    }     
    return (
        <AuthContext.Provider value= {value}>
            {/*if not loading don't render children*/}
            {!loading && children}
        </AuthContext.Provider>
    )
}
