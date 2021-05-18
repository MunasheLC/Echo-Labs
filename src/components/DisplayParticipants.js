import { Card } from "react-bootstrap";
import { Link} from "react-router-dom";
import shortid from 'shortid';
import {auth, db } from "../firebase";

var datahover = "Available";
const DisplayParticipants = (props) => {
    const {
        array,
        tutors
    } = props

    return (
        <div>
            <div id ="row2" className="lab-row">
            {
                array.map(value => (
                    <Card id="lab-card-style-3" key={shortid.generate()}>
                <Link className = 'lab-links' style={{textDecoration: "none"}}>
                  <Card.Body>
                    {/* display the lab card and its name(.Lab_Name taken from the lab collection in firestore) on the dashboard */}
                      <h5 className="dash-cards-h3">{value}</h5>   
                  </Card.Body>
                </Link>
              </Card>  
                ))
                }
            </div>
            <hr></hr>
            <h2 className="h2-heading">Lab Tutors</h2>
            <div id ="row3" className="lab-row">
                {
                tutors.map(value => (
                <Card id="lab-card-style-4" data-hover={datahover} className="tutors" style={{}} key={shortid.generate()}>
                    <Link className = 'lab-links' style={{textDecoration: "none"}}>
                    <Card.Body>
                        {/* display the lab card and its name(.Lab_Name taken from the lab collection in firestore) on the dashboard */}
                        <h5 id="tutorCard" className="dash-cards-h3">{value}</h5>  
                    </Card.Body>
                    </Link>
                </Card>
                ))
            }
            {
                    tutors.forEach((v:String) => {
                        checkInCall(v)
                    })
            }
            </div>
        </div>
    );
}
export default DisplayParticipants

//Function checks if a given user is in a call
const checkInCall = async(email) =>{
    const usercollection = db.collection('users'); 
        const userCheck = await usercollection.where('email', '==', email).get(); 
        if (userCheck){ //if there is a match
             userCheck.forEach(doc =>{ 
                 checkCall(doc.id)
                })
        }
}

//Function that checks if a user is in a call, if so display their card in lobby as busy and change background color
const checkCall=async(docid)=>{
    const userDoc = await db.doc(`users/${docid}`).get(); 
    const userData = userDoc.data();
    const userinCall = userData.inCall;

    if (userinCall == true){
        // document.getElementById('lab-card-style-4').style.background='#CF6679';
        // document.getElementById('tutorCard').style.color='white';
        datahover='In Call';
    }
    else{
        datahover = "Available";
    }
}
//Function that updates a users call status to true on firestore
export const inCallTrue = async(email)=>{
    const usercollection = db.collection('users'); 
        const userCheck = await usercollection.where('email', '==', email).get(); 
        if (userCheck){ //if there is a match
             userCheck.forEach(doc =>{ 
                 const userDoc = db.collection('users').doc(doc.id); 
                    userDoc.update({ 
                        inCall : true
                    })
                })
             }
 }
 //Function that updates a users call status to false on firestore
 export const inCallFalse = async(email)=>{
    const usercollection = db.collection('users'); 
        const userCheck = await usercollection.where('email', '==', email).get(); 
        if (userCheck){ 
             userCheck.forEach(doc =>{ 
                 const userDoc = db.collection('users').doc(doc.id); 
                    userDoc.update({
                        inCall : false
                    })
                })
             }
 }