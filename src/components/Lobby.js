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
import {removeAllFromLab} from './Participants'
var lab="";

export default function Lobby() {

	const [error, setError] = useState("")
	const { currentUser, logout } = useAuth()
	const history = useHistory()
	const hist = useHistory()

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
			history.push("/")

		} catch{
		setError("Failed to go to dashboard")
		}

	}
	//removes all users from the participant list when the host clicks end lab
	async function handleEndLab(){
		setError("")

		try{
			console.log("handleEndLab")
		    var labid = await getLabData(lab);
			const labDoc = await db.doc(`labs/${labid}`).get();
			console.log(labDoc)
        	const labData = labDoc.data();
        	const participants = labData.Participants;
			console.log(participants)
        	if (participants){
            	participants.forEach((participant:String) => {  //for each participant ( FYI these are user emails ) in the participant list
					removeAllFromLab(participant,lab);
					hist.push("/dashboard")
            });
        }

		} catch{
		setError("Failed to go to dashboard")
		}

	}
  	document.body.style.background="#1c1f3e";

	  const [makeVisable, setmakeVisable] = useState(false);

	  const handleClose = () => setmakeVisable(false);
	  const handleVisability = () => setmakeVisable(true);

	  const [makeVisable2, setmakeVisable2] = useState(false);

	  const handleClose2 = () => setmakeVisable2(false);
	  const handleV = () => setmakeVisable2(true);

	  //Function that checks if the current user is a tutor/ student
	  // if it's a tutor the Help requests button is displayed. 
	  // else the Start Code button is displayed
	  async function checkTutors(){
		var labid = await getLabData(lab);
		const labDoc = await db.doc(`labs/${labid}`).get();
        const labData = labDoc.data();
        const tutors = labData.Lab_Admins; 
		const host = labData.Host_email;
        if (tutors.includes(auth.currentUser.email)){ 
			document.getElementById('requestButton').style.display = 'block';

        }
		else{
			document.getElementById('startCoding').style.display = 'block';
		}
		if (host == auth.currentUser.email){
			document.getElementById('endButton').style.display = 'block';
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
							
							<div id="userType" className="w-100 text-center mt-2"><h2 id="permission" className="Button-text">{lab} Lobby</h2></div>

							<Button id="startCoding" onClick={handleRoom} style={{backgroundColor:"#1f2647", marginLeft:"2.5vw", width:"15vw", display:"none"}}>
								<i className="fas fa-bug"><h2 className="Button-text-1">Start Coding</h2></i>
							</Button>

							<Button id="requestButton" onClick={handleVisability}>
								<i className="fas fa-bug"><h2 className="Button-text-1">Requests</h2></i>
							</Button>
							{Check()}
							<Button variant="danger" onClick={handleEndLab} id="endButton" style={{backgroundColor:"#1f2647", marginLeft:"2.5vw", marginTop:"0.5vw" ,width:"15vw", display:"none"}}>
								<h2 className="Button-text-1">End Lab</h2>
							</Button>

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

							<div id="logoutButton" style={{top:"13vh"}}>
							<Button variant="info" onClick={handleLeave}>
								<h2 className="Button-text-1"> Leave </h2>
							</Button>
							</div>

						</ul>
					</div>

				</div>
				<div id="dash-card-container1"> 
				<div className="w-100 text-right mt-2" data-hover='info'>
						<i data-hover='info' style={{color:'white', fontSize: '30px', cursor:'pointer'}} onClick={handleV} className="fas fa-info-circle"></i>
				</div>

							<Modal show={makeVisable2} onHide={handleClose2} animation={false}>
								<Modal.Header closeButton>
									<Modal.Title>The Lobby</Modal.Title>
								</Modal.Header>
								<Modal.Body>
								<p> Here a list of participants of the lab room are displayed as well as a list of Tutors </p>
								<p> - Tutor Permissions</p>
								<p> If you are a Tutor you have the ability to:</p>
								<ul style={{position:"relative", left:"2vw"}}>
									<li> View students help requests (The Request Button)</li>
									<li> Join a students coding session in order to help them in which a call starts</li>
								</ul>
								<p> - Student Permissions </p>
								<ul style={{position:"relative", left:"2vw"}}>
									<li> Ability to access a coding session in which you can code in Python and use a terminal</li>
								</ul>
								<p>- The Coding Session - "Start Coding"</p>
								<p>The Coding session contains a text editor that runs python code as well as options for camera and audio.</p>
								<p>Here, there is an option to send a help request. This request will be sent to the tutor. If they accept this request a call will be connected between both of you.</p>
								<p> The text editor is entirely Peer-To-Peer which means both of you can see what each other are typing, making peer programming easy.</p>
								</Modal.Body>
								<Modal.Footer>
									<Button variant="secondary" onClick={handleClose2}>
										Close
									</Button>
								</Modal.Footer>
							</Modal>

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
