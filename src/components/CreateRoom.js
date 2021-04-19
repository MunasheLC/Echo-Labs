import React from 'react'
import { v4 as uuid } from "uuid"
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";


const CreateRoom = (props) => {
    function create(){
        const id = uuid()
        props.history.push(`/room/${id}`)
    }

    return (
        <Card id="userinput-container">
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: "white" }}>Lab-Room</h2>
          <hr></hr>
          <i style={{color:"white", fontSize: "6rem", position:"relative", top:"2vh" ,right: "1vw"}} className="fas fa-chalkboard-teacher w-100 text-center mt-2"></i>
          <div style={{position:"relative", top: "10vh"}} className="w-100 text-center mt-2">
				<Button style={{width: "100%"}} variant="info" onClick={create}>
						<h2 className="Button-text"> Join </h2>
				</Button>
			</div>
          {/* <button onClick={create}> Join Room </button> */}

          <div className="w-100 text-center mt-2">
            <Link to="/user-lab-rooms" style={{ color: "white" , position:"relative", top:"10vh"}}> Back to Labs </Link>
          </div>

        </Card.Body>
      </Card>
    )
}

export default CreateRoom
