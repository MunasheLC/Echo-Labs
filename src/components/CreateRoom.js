import React from 'react'
import { v4 as uuid } from "uuid"
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { getCheckID, makeActive, getCheckActive, getLabHost } from './Host'
import { auth } from "../firebase"
import { db } from "../firebase"

var lab="";
const CreateRoom = (props) => {
  const currentUser = auth.currentUser
  const email = currentUser.email

    function join_room(){
        getCheckID(lab).then((value) => {props.history.push(`/room/${value}`)});

    }

    function create(){
      makeActive(lab);
      join_room();
    }
    function Join(){
      join_room();
    }
    function isHost(){
      getLabHost(lab).then((value) => { if (value === email){ document.getElementById('Start').style.display = 'block';}}) // if the promise results to true show the user the createLabRoom option in navbar
    }

    function isActive(){
      getLabHost(lab).then((value) => { if ( value !== email){  
        getCheckActive(lab).then((v) => { if (v === true){document.getElementById('Join').style.display = 'block';}}) }});
    }

    return(
      //if user == host give a start option
      // if user in student list and start is true , give a join option
        <Card id="userinput-container">
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: "white" }}>Lab-Room</h2>
          <hr></hr>
          <i style={{color:"white", fontSize: "6rem", position:"relative", top:"2vh" ,right: "1vw"}} className="fas fa-chalkboard-teacher w-100 text-center mt-2"></i>
          <div style={{position:"relative", top: "10vh"}} className="w-100 text-center mt-2">

          <Button id="Start" style={{width: "100%", display:"None"}} variant="info" onClick={create}>
						<h2 className="Button-text"> Start </h2>  
				</Button>
        {isHost()}

				<Button id="Join" style={{width: "100%", display:"None"}} variant="info" onClick={Join}>
						<h2 className="Button-text"> Join </h2>  
				</Button>
        {isActive()}
			</div>
          {/* <button onClick={create}> Join Room </button> */}

          <div className="w-100 text-center mt-2">
            <Link to="/user-lab-rooms" style={{ color: "white" , position:"relative", top:"10vh"}}> Back to Labs </Link>
          </div>

        </Card.Body>
      </Card>
    )
}

export function getLab(labID){
  lab=labID;
}

export default CreateRoom
