import { db, auth } from "../firebase";
import "firebase/auth"
import "firebase/firestore"
import firebase from 'firebase/app'
import React, { useState, useEffect } from 'react';
import DisplayParticipants from "./DisplayParticipants"
import {getLabData} from "./Host";


const Participants = (props) => {
    const {
        labName
    } = props
    const [studentList, setStudentList] = useState( [] );
    const [tutorList, setTutorList] = useState( [] );

    const UpdateParticipants = async(lab) =>{ //updates the participants list in the labs firestore collection.
        const labcollection = db.collection('labs'); // gets the labs collection from firestore
        const labCheck = await labcollection.where('Lab_Name', '==', lab).get(); //queries the lab collection to find a lab that has a matching name to the specific lab
        if (labCheck){ //if there is a match
             labCheck.forEach(doc =>{ 
                 const labDoc = db.collection('labs').doc(doc.id); //gets the labs document infomartion
                 labDoc.update({ //updates the labs fields in order to add the current users email to the participant list.
                     Participants : firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
                 })
             });
        }
    }
    
    //gets the participant list using the labid on firestore
    const getParticipants = async(labid) => { 
        const students = [];
        const tutorArray = [];
        const labDoc = await db.doc(`labs/${labid}`).get();
        const labData = labDoc.data();
        const participants = labData.Participants;
        const tutors = labData.Lab_Admins; //gets list of tutors
        if (participants){
            participants.forEach((participant:String) => {  //for each participant ( FYI these are user emails ) in the participant list
                if (!tutors.includes(participant)){ //if the participant is not a tutor add them to the student list
                    students.push(participant);
                }
                else{
                    tutorArray.push(participant);
                }
            });
        }
        setStudentList(students);
        setTutorList(tutorArray)
    }


    const SetParticipants = ()=>{
        useEffect(() => {
        const interval = setInterval(async() => {
            UpdateParticipants(labName);
            var labID = await getLabData(labName);
            await getParticipants(labID);
        },2000); //runs every 2 seconds
        return () => clearInterval(interval);
        },[]);
    };
    SetParticipants();

    // const run=()=>{ //is this even needed?
    //     useEffect(() => {
    //     
    //     //   console.log("in run");
    //     }, [studentList, tutorList]);

    // }

    return(
        <div>
            {/* {run())} */}
            <DisplayParticipants array={studentList} tutors={tutorList}/>
        </div>
    )

}
export default Participants;


export const removeUserFromLabList = async(lab) =>{
        const email = auth.currentUser.email
        const labcollection = db.collection('labs');
        const labCheck = await labcollection.where('Lab_Name', '==', lab).get();
        if (labCheck){
            labCheck.forEach(doc =>{                                                                                                                                                                                                                                                                                                      const labDoc = db.collection('labs').doc(doc.id);
                 labDoc.update({
                    Participants: firebase.firestore.FieldValue.arrayRemove(email)
                 })
              });
         }
    }
    export const removeAllFromLab = async(email,lab) =>{
        const labcollection = db.collection('labs');
        const labCheck = await labcollection.where('Lab_Name', '==', lab).get();
        if (labCheck){
            labCheck.forEach(doc =>{                                                                                                                                                                                                                                                                                                      const labDoc = db.collection('labs').doc(doc.id);
                 labDoc.update({
                    Participants: firebase.firestore.FieldValue.arrayRemove(email)
                 })
              });
         }
    }