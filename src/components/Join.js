import React from 'react'
import { Form, Button, Card } from "react-bootstrap";
import { Link} from "react-router-dom";
import "firebase/auth"
import "firebase/firestore"
import { auth } from "../firebase"
import { db } from "../firebase"
import firebase from 'firebase/app'
import { useState, useGlobal } from 'react'
import { Modal} from "react-bootstrap"
import {useHistory } from "react-router-dom"
import {getLab} from './CreateRoom';

var lab = "";

export const addLabToUsersDocument = async(labID) =>{ //adds the labid to the user's user collections lab field in firestore
  const usercollection = db.collection('users');
  const currentUser = auth.currentUser;
  const email = currentUser.email; //get current users email 
  const emailMatch = await usercollection.where('email', '==', email).get(); //check if there is an email in firestore usercollection that is  = to the current users email

  if (emailMatch.empty) { //if no match:
      console.log('No email found within user collection');
      return;
  } 
  emailMatch.forEach(doc =>{ //else if there is a email match
      const userDoc = db.collection('users').doc(doc.id);
      userDoc.update({
          labs: firebase.firestore.FieldValue.arrayUnion(labID) // update the users firestore to add the labid to their lab list.
      })
  });

}

export default function Join(){
  const [makeVisable, setmakeVisable] = useState(false);

  const handleClose = () => setmakeVisable(false);
  const handleVisability = () => setmakeVisable(true);

  const history = useHistory()
  var admin = "";
  async function adminCheckKey(){ //checks if user key is associated with lab_Admin if not it calls studentCheckKey() to check if the key is a students
    const labcollection = db.collection('labs');
    const labcodeinput = document.getElementById("labcode-input").value; //users inputted code
    console.log(labcodeinput);

    const adminKeyMatch = await labcollection.where('Lab_Key_Admin', '==', labcodeinput).get(); //checks if there is an admin key in firebase that is = to the inputted key
    if (adminKeyMatch.empty) { //if nothing shows up stating that there is a match
            console.log('Password incorrect - admin');
            studentCheckKey(labcollection, labcodeinput); //check if the key matches the student key
            return; 
    } 
    console.log('password correct'); //else password is correct
    adminKeyMatch.forEach(doc =>{ 
            console.log(doc.id, '=>', doc.data());
            lab = doc.data().Lab_Name;
            const labDoc = labcollection.doc(doc.id);
            labDoc.update({ 
              Lab_Admins : firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) //add current users email to lab admins in firestore
          })
            admin = true;
            addLabToUsersDocument(doc.id) // if key is valid add lab to users firestore lab list, display lab on their dashboard
            document.getElementById("printStatus").innerHTML="You have been granted access to: " + lab + " as a tutor. This lab will now displayed in your Lab Rooms";
            handleVisability();
          });
    
  }

  async function studentCheckKey(labcollection, labcodeinput){
    const studentKeyMatch = await labcollection.where('Lab_Key_Student', '==', labcodeinput).get(); //if inputted key is student
    if (studentKeyMatch.empty) {
            console.log('Password incorrect - student');
            return;
    } 
    console.log('password correct');
    studentKeyMatch.forEach(doc =>{
            const labDoc = db.collection('labs').doc(doc.id);
            lab = doc.data().Lab_Name;
            labDoc.update({
              Lab_Students : firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) //add current user as a student in firestore .
          })
            admin=false;
            addLabToUsersDocument(doc.id)
            document.getElementById("printStatus").innerHTML="Successfully joined : " + lab;
            handleVisability();


    });
  }
  function pushToLab(){
    history.push("/user-lab-rooms");
  }

  async function handleClick(e) {
    e.preventDefault();
    adminCheckKey();
  }


  return(
    <Card id="userinput-container">
      <Card.Body>
        <h2 className="text-center mb-4" style={{color:"white"}}>Join A Lab</h2>
          <Form id="create-form">
            <Form.Group id="lab-name">
              <Form.Label style={{color:"white"}}>Please enter Lab room code</Form.Label>
                <Form.Control
                  type="text"
                  id="labcode-input"
                  required
                />
            </Form.Group>


            <Button className="w-100" onClick={handleClick}>
              Join Room
            </Button>
          </Form>

          <div id="printStatus" style={{marginTop:"10px",color:"white"}}></div>
          <Modal show={makeVisable} onHide={handleClose} animation={false}>
								<Modal.Header closeButton>
									<Modal.Title>You have joined:</Modal.Title>
								</Modal.Header>
								<Modal.Body>
										<h2> {lab} </h2>

								</Modal.Body>
								<Modal.Footer>
                <Link to='/create-room' onClick={() => getLab(lab)}>
                  <Button variant="secondary">
										Go to {lab}
									  </Button>
                </Link>
									<Button variant="secondary" onClick={handleClose}>
										Close
									</Button>
								</Modal.Footer>
							</Modal>


          <div className="w-100 text-center mt-2">
          <Button variant="info" style={{marginTop:"10vh"}}>
            <Link style={{color:"white"}} to="/"> Back to Dashboard</Link>
            </Button>
          </div>
      </Card.Body>
    </Card>
  );
}