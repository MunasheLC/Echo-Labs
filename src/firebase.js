import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/firestore"


const firebaseConfig = {
    apiKey: process.env.REACT_APP_ECHO_API_KEY,
    authDomain: process.env.REACT_APP_ECHO_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_ECHO_DATABASE_URL,
    projectId: process.env.REACT_APP_ECHO_PROJECT_ID,
    storageBucket: process.env.REACT_REACT_APP_ECHO_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_ECHO_MESSAGIN_SENDER_ID,
    appId: process.env.REACT_APP_ECHO_APP_ID,
    measurementId: process.env.REACT_APP_ECHO_MEASUREMENT_ID
}

//Remove this later
// console.log(firebaseConfig)

const app = firebase.initializeApp(firebaseConfig)
export const auth = app.auth()
export const database = app.firestore()
export default app