import React, { useState, useGlobal } from 'react'
import { Modal, Card, Button} from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Participants from "./Participants"
import {removeUserFromLabList} from "./Participants"
import './Dashboard.css'
import { getuserRoomID } from './Host'
import {getLab3} from './Room'
import {getLabData} from './Host'
import Requests from './Requests';
import {auth,db } from '../firebase';
var lab="";

export default function Lobby() {

	const [error, setError] = useState("")
	const { currentUser, logout } = useAuth()
	const history = useHistory()

	async function handleRoom(){
		try{
			//Once clicked push the student into their specific room
			getuserRoomID(lab).then((value) => {history.push(`/room/${value}`)});
			getLab3(lab);
		} catch{
		setError("Failed to go to room")
		}
	}

	async function handleLeave(){
		setError("")

		try{
			//removes user from the participant list when they click the leave button
			removeUserFromLabList(lab);
			history.push("/dashboard")

		} catch{
		setError("Failed to go to dashboard")
		}

	}
  	document.body.style.background="#1c1f3e";

	  const [makeVisable, setmakeVisable] = useState(false);

	  const handleClose = () => setmakeVisable(false);
	  const handleVisability = () => setmakeVisable(true);

	  //Function that checks if the current user is a tutor/ student
	  // if it's a tutor the Help requests button is displayed. 
	  // else the Start Code button is displayed
	  async function checkTutors(){
		var labid = await getLabData(lab);
		const labDoc = await db.doc(`labs/${labid}`).get();
        const labData = labDoc.data();
        const tutors = labData.Lab_Admins; 
        if (tutors.includes(auth.currentUser.email)){ 
			document.getElementById('requestButton').style.display = 'block';

        }
		else{
			document.getElementById('startCoding').style.display = 'block';
		}

	}
	function Check(){
		checkTutors();
	}

	return (
		<>

			<div id="dash-container" className="animate__animated animate__bounceInRight" style={{}}>  
				<div className="dash-nav" style={{position:"relative", left: "20px",width:"20vw", height: "100%",backgroundColor:"#2a315d"}}>
					<div className="dash-logo" style={{ position:"relative", top:"5vh",width:"10vw", height:"30vh" ,margin:"0 auto", color:"white"}}>

						<div className= "dash-echo-lines">
							<div id="dash-x" className="animate__animated animate__bounceInDown"></div>
							<div id="dash-y" className="animate__animated animate__bounceInDown animate__delay-1s"></div>
							<div id="dash-z" className="animate__animated animate__bounceInDown animate__delay-2s" ></div>
						</div>

						<div className="circle">
							<i className="fas fa-user-secret fa-3x center"></i>
						</div>

					</div>

					<div className="w-100 text-center mt-2" style={{position:"relative",height:"45vh"}}>
						<ul className="nav flex-column">
							
							<div id="userType" className="w-100 text-center mt-2"><h2 id="permission" className="Button-text">{lab}</h2></div>

							<Button id="startCoding" onClick={handleRoom} style={{backgroundColor:"#1f2647", marginLeft:"2.5vw", width:"15vw", display:"none"}}>
								<i className="fas fa-bug"><h2 className="Button-text-1">Start Coding</h2></i>
							</Button>

							<Button id="requestButton" onClick={handleVisability}>
								<i className="fas fa-bug"><h2 className="Button-text-1">Requests</h2></i>
							</Button>
							{Check()}

							<Modal show={makeVisable} onHide={handleClose} animation={false}>
								<Modal.Header closeButton>
									<Modal.Title>Requests</Modal.Title>
								</Modal.Header>
								<Modal.Body>
										<Requests labName={lab}/>
								</Modal.Body>
								<Modal.Footer>
									<Button variant="secondary" onClick={handleClose}>
										Close
									</Button>
								</Modal.Footer>
							</Modal>

							<div id="logoutButton" style={{top:"25vh"}}>
							<Button variant="info" onClick={handleLeave}>
								<h2 className="Button-text-1"> Leave </h2>
							</Button>
							</div>

						</ul>
					</div>

				</div>
				<div id="dash-card-container"> 
					<h2 className="h2-heading">Participants</h2>
				    <Participants
					labName={lab}
					/>
				</div>
			</div>
		</>
	)
}

//Function is used in order to bring across the current lab that the user is in 
export function getLab2(labID){
    lab=labID;
}
