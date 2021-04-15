import "firebase/auth"
import "firebase/firestore"
import { auth } from "../firebase"
import { db } from "../firebase"


export default async function Admin(){
    const currentUser = auth.currentUser;
    const userId = currentUser.uid;
    if (currentUser){
        if (userId){
            const userDoc = await db.doc(`users/${userId}`).get(); // get users information from the user collection in firestore using their id
            const userData = userDoc.data();
            const userPermissions = userData.Admin; // gets the Admin field info from the users collection in firestore and stores a promise of true or false
            return userPermissions; //returns promise with the result inside
        }
    }
}

export const getUserPermissions = async() =>{
    const result = await Admin(); //gets the promise returned by Admin
    console.log(" getUserPermissions " + result);
    return result;
};