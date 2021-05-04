import {getLabData} from './Host';
import { db, auth } from "../firebase";
import "firebase/auth"
import "firebase/firestore"
import firebase from 'firebase/app'
import React, { useState, useEffect } from 'react';
import DisplayRequests from "./DisplayRequests"

//Function updates request list on firestore in the labs collection 
export const UpdateRequests = async(lab) =>{ 
    const labcollection = db.collection('labs'); // gets the labs collection from firestore
    const labCheck = await labcollection.where('Lab_Name', '==', lab).get(); //queries the lab collection to find a lab that has a matching name to the specific lab
    if (labCheck){ //if there is a match
         labCheck.forEach(doc =>{ 
             const labDoc = db.collection('labs').doc(doc.id); //gets the labs document infomartion
             labDoc.update({ //updates the labs fields in order to add the current users email to the request list.
                 Requests : firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
             })
         });
    }
}

//Function removes a user from the requestList
export const removeUserFromRequestList = async(lab,email) =>{
    const labcollection = db.collection('labs');
    const labCheck = await labcollection.where('Lab_Name', '==', lab).get();
    if (labCheck){
        labCheck.forEach(doc =>{
             const labDoc = db.collection('labs').doc(doc.id);
             labDoc.update({
                Requests: firebase.firestore.FieldValue.arrayRemove(email)
             })
          });
     }
}

const Requests = (props) =>{
    const {
        labName
    } = props

    const [requestList, setRequestList] = useState( [] );

   //Function gets the request list from the labid
   const getRequests = async(labid) => { 
       const requests = [];
       const labDoc = await db.doc(`labs/${labid}`).get();
       const labData = labDoc.data();
       const participants = labData.Requests;
       if (participants){
           participants.forEach((participant:String) => {  //for each email in request list
                requests.push(participant);
           });
       setRequestList(requests);
        }
    }

    const SetRequests = ()=>{
        useEffect(() => {
        const interval = setInterval(async() => {
            var labID = await getLabData(labName);
            await getRequests(labID);
        },2000); //runs every 2 seconds
        return () => clearInterval(interval);
        },[]);
    };
    SetRequests();
    return(
        <div>
            <DisplayRequests lab={labName} array={requestList}/>
        </div>
    )


}
export default Requests;