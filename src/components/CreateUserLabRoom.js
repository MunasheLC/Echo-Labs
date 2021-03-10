import React,  { useState }from 'react'
import { Form, Button, Card} from "react-bootstrap";
import { Link} from "react-router-dom";
import "firebase/auth"
import "firebase/firestore"
import { auth } from "../firebase"
import { db } from "../firebase"
import firebase from 'firebase/app'


export default function CreateUserLabRoom(){
  const [student_password, setStudentPassword] = useState('');
  const [admin_password, setAdminPassword] = useState('');

	async function handleClick(e) {
    e.preventDefault();
    document.getElementById('generated-text').style.display = 'block';
    generatePassword();
  }

  async function generatePassword(){
    var generator = require('generate-password');
 
    const student_password = generator.generate({
            length: 10,
            numbers: true
    });
    const admin_password = generator.generate({
          length: 10,
          numbers: true
    });
    setStudentPassword(student_password);
    setAdminPassword(admin_password);

    checkLabRoomExists(student_password, admin_password);
  }

  async function checkLabRoomExists(studentpassword, adminpassword){
    const labroomName= document.getElementById("labroom-name").value;
    const labcollection = db.collection('labs');
    //adds to labs collection

    //check if collection contains new lab name
    const snapshot = await labcollection.where('Lab_Name', '==', labroomName).get();
    const currentUser = auth.currentUser;
    const email = currentUser.email;

    if (snapshot.empty) {
        console.log("collection doesn't contain lab: " + labroomName)
        db.collection('labs').add({
        Lab_Name: document.getElementById("labroom-name").value,
        Lab_Key_Student: studentpassword,
        Lab_Key_Admin: adminpassword,
        Host_email: email})
        addHosttoLab(email);
    }
    else{
      console.log("collection contains lab" + labroomName); 
      //print error alert message saying lab exists try again.

    }

  }
  async function addHosttoLab(useremail){ //maybe put this function within addUsertoLab. Dont need 2 seperate?
    //check if there is  a lab that contains the inputted lab name
    const labroomName= document.getElementById("labroom-name").value;
    const labcollection = db.collection('labs');
    const snapshot = await labcollection.where('Lab_Name', '==', labroomName).get();
    if (snapshot){
      snapshot.forEach(doc =>{
        // console.log("Adding user to labRoom " + useremail);
        addUserToLab(useremail, doc.id);
      });
    }
  }
  
  async function addUserToLab(useremail, newLabId){
    const usercollection = db.collection('users');
    const snapshot = await usercollection.where('email', '==', useremail).get();
  
    if (snapshot.empty) {
        console.log('No email found within user collection');
        return;
    } 
  
    snapshot.forEach(doc =>{
        const userDoc = db.collection('users').doc(doc.id);
        userDoc.update({
            labs: firebase.firestore.FieldValue.arrayUnion(newLabId)
        })
    });
  }

  return(
    <>
      <Card id="userinput-container">
        <Card.Body>
          <h2 className="text-center mb-4" style={{color:"white"}}>Create a Lab Room</h2>
            <Form id="create-form">
              <Form.Group id="lab-name">
                <Form.Label style={{color:"white"}}>New Lab Room Name</Form.Label>
                <Form.Control
                  type="text"
                  id="labroom-name"
                  // ref={emailRef}
                  required
                  // defaultValue={currentUser.email}
                />
              </Form.Group>

              <Button className="w-100" onClick={handleClick}>
                Create Room & Generate Password
              </Button>
            </Form>

            <div className="w-100 text-center mt-2">
              <Link style={{color:"white"}} to="/user-lab-rooms"> Back to Labrooms</Link>
            </div>

            <div id="generated-text" style={{color:"white"}}>
              <p>Student Generated Password:</p><p style={{color:"blue"}}>{student_password}</p>
              <p>Admin Generated Password:</p><p style={{color:"blue"}}>{admin_password}</p>
              Please copy and share the above password in order for students/admins to join the labroom.
            </div>

        </Card.Body>
      </Card>
    </>
  );
}