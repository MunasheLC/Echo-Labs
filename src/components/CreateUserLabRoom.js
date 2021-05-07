import React,  { useState }from 'react'
import { Form, Button, Card} from "react-bootstrap";
import { Link} from "react-router-dom";
import "firebase/auth"
import "firebase/firestore"
import { auth } from "../firebase"
import { db } from "../firebase"
import firebase from 'firebase/app'
import { addLabToUsersDocument } from './Join'
import { v4 as uuid } from "uuid"


export default function CreateUserLabRoom(){

  const [student_password, setStudentPassword] = useState('');
  const [admin_password, setAdminPassword] = useState('');

	async function handleClick(e) {
    e.preventDefault();
    document.getElementById('generated-text').style.display = 'block';
    generatePassword();
  }

  async function generatePassword(){ //function creates a random generated password for both the student and the tutor(Admin) in which they can use as keys to join a labroom
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

    checkLabRoomExists(student_password, admin_password); //once keys have been generated, check if the room already exists
  }

  async function checkLabRoomExists(studentpassword, adminpassword){
    const labroomName = document.getElementById("labroom-name").value; //gets the inputted lab room name the user wants to create
    const labcollection = db.collection('labs'); // gets the labs collection from firestore
    //adds to labs collection

    //check if collection contains new lab name
    const labCheck = await labcollection.where('Lab_Name', '==', labroomName).get(); //get info if there is a labroom name in labs collection that already exists
    const currentUser = auth.currentUser;
    const email = currentUser.email;
    const uid = uuid();

    if (labCheck.empty) { //if nothing exists in the labroom collection with that name, add the newly created name to the labs collection
        console.log("collection doesn't contain lab: " + labroomName)
        db.collection('labs').add({  //adds the newly created lab to the labs collection in firestore along with specific fields to attach to it.
        Lab_Name: document.getElementById("labroom-name").value,
        Lab_Key_Student: studentpassword,
        Lab_Key_Admin: adminpassword,
        RoomID: uid,
        Host_email: email})
        addHosttoLab(); //automatically add the lab id and information to the users lab field in their user collection
    }
    else{ //else if firestore already contains that labname:
      console.log("collection contains lab" + labroomName);  
      //print error alert message saying lab exists try again.
    }

  }
  async function addHosttoLab(){ 
    //check if there is  a lab that contains the inputted lab name
    const labroomName= document.getElementById("labroom-name").value;
    const labcollection = db.collection('labs');
    const labCheck = await labcollection.where('Lab_Name', '==', labroomName).get();
    if (labCheck){
      labCheck.forEach(doc =>{
        addLabToUsersDocument(doc.id);
        addUserToAdminList(doc.id); //added this to add host to tutor list in labroom.
      });
    }
  }

  async function addUserToAdminList(labName){
    const labcollection = db.collection('labs');
    const labDoc = labcollection.doc(labName);
    labDoc.update({ 
      Lab_Admins : firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) //add current users email to lab admins in firestore
  })
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