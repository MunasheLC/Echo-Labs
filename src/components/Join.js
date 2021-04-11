import React from 'react'
import { Form, Button, Card } from "react-bootstrap";
import { Link} from "react-router-dom";
import "firebase/auth"
import "firebase/firestore"
import { auth } from "../firebase"
import { db } from "../firebase"
import firebase from 'firebase/app'

export default function Join(){

  async function addUserToLabList(labID){
    const usercollection = db.collection('users');
    const currentUser = auth.currentUser;
    const email = currentUser.email;
    const snapshot = await usercollection.where('email', '==', email).get();

    if (snapshot.empty) {
        console.log('No email found within user collection');
        return;
    } 
    snapshot.forEach(doc =>{
        const userDoc = db.collection('users').doc(doc.id);
        userDoc.update({
            labs: firebase.firestore.FieldValue.arrayUnion(labID)
        })
    });

  }
  async function checkKey(){
    const labcollection = db.collection('labs');
    const labcodeinput = document.getElementById("labcode-input").value;
    console.log(labcodeinput);

    const snapshot = await labcollection.where('Lab_Key', '==', labcodeinput).get();
    if (snapshot.empty) {
            console.log('Password incorrect');
            return;
    } 
    console.log('password correct');
    snapshot.forEach(doc =>{
            console.log(doc.id, '=>', doc.data());
            addUserToLabList(doc.id)
    });
  }

  async function handleClick(e) {
    e.preventDefault();
    checkKey() 
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
                  // ref={emailRef}
                  required
                  // defaultValue={currentUser.email}
                />
            </Form.Group>

            <Button className="w-100" onClick={handleClick}>
              Join Room
            </Button>
          </Form>

          <div className="w-100 text-center mt-2">
            <Link style={{color:"white"}} to="/"> Back to Dashboard</Link>
          </div>
      </Card.Body>
    </Card>
  );
}