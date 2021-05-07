import React, { useState } from 'react'
import { Modal, Button} from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { Card } from 'react-bootstrap';
import { auth } from "../firebase"
import { getUserPermissions} from './Admin'
import './Dashboard.css'
import BarChart from './Stats'




export default function Dashboard() {

	const [error, setError] = useState("")
	const { currentUser, logout } = useAuth()
	const history = useHistory()



	async function handleLogout(){
		setError("")

		try{
			await logout()
			history.push("/login")

		} catch{
		setError("Failed to logout")
		}

	}
  	document.body.style.background="#1c1f3e";

	function adminCheck(){
		getUserPermissions().then((value) => { if (value === true){ document.getElementById('permission').innerHTML = "Tutor"; } // if the promise results to true , display Admin on their dashboard
	})}

	const [makeVisable, setmakeVisable] = useState(false);

	const handleClose = () => setmakeVisable(false);
	const handleV = () => setmakeVisable(true);

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

					<div id="userType" className="w-100 text-center mt-2"><h2 id="permission" className="Button-text">Student</h2></div>
					{adminCheck()}
				

					<div id="logoutButton" className="w-100 text-center mt-2">
						<Button variant="info" onClick={handleLogout}>
							<h2 className="Button-text"> Logout</h2>
						</Button>
					</div>

				</div>

				<div id="dash-card-container1">
				<div className="w-100 text-right mt-2" data-hover='info'>
						<i data-hover='info' style={{color:'white', fontSize: '30px', cursor:'pointer'}} onClick={handleV} className="fas fa-info-circle"></i>
				</div>

				<Modal show={makeVisable} onHide={handleClose} animation={false}>
								<Modal.Header closeButton>
									<Modal.Title>How This Works</Modal.Title>
								</Modal.Header>
								<Modal.Body>
								 <p>You are either a Tutor or a Student. Your specific role is displayed under the cool incognito man on your dashboard</p>
								 <p>On your dashboard you can see 4 options:</p>
								 <ul style={{position:"relative", left:"2vw"}}>
									<li> Lab Rooms: This is where your lab rooms are listed in which you have joined</li>
									<li> Join: This is where you enter a key to join a new Lab room </li>
									<li> Stats: </li>
									<li> User Profile: Update your user profile here.</li>
								</ul>
								<p> Tutor Permissions</p>
								<p> If you are a Tutor you have the ability to:</p>
								<ul style={{position:"relative", left:"2vw"}}>
									<li> Create a new Lab Room - This option is displayed in Lab Rooms</li>
									<li> Start and end a Lab session </li>
									<li> Within a labs lobby you can view students help requests </li>
									<li> Ability to join a students coding session in order to help them </li>
								</ul>
								<p> Student Permissions </p>
								<ul style={{position:"relative", left:"2vw"}}>
									<li> Ability to access a coding session in which you can code in Python and use a terminal</li>
								</ul>


								</Modal.Body>
								<Modal.Footer>
									<Button variant="secondary" onClick={handleClose}>
										Close
									</Button>
								</Modal.Footer>
							</Modal>


					<div id="row">              
						<Link to='/user-lab-rooms' className = 'lab-links' style={{textDecoration: "none"}}> 
							<Card id="lab-card-style-1" style={{backgroundColor:"#7845d9"}}>
								<Card.Body>
									<h2 className="dash-cards-h2"> Lab Rooms</h2>
								</Card.Body>
							</Card>
						</Link>

						<Link to='/join' className = 'lab-links' style={{textDecoration: "none"}}>
							<Card id="lab-card-style-1" style={{backgroundColor:"#7fb1ca"}}>
								<Card.Body>
									<h2 className="dash-cards-h2"> Join </h2>
								</Card.Body>
							</Card>
						</Link>

						<Link to='/Stats' className = 'lab-links' style={{textDecoration: "none"}} >
							<Card id="lab-card-style-1" style={{backgroundColor:"#5c7fd3"}}>
								<Card.Body>
									<h2 className="dash-cards-h2"> Stats</h2>
								</Card.Body>
							</Card>
						</Link>

						<Link to='/update-profile' className= 'lab-links' style={{textDecoration: "none"}} >
							<Card id="lab-card-style-1" style={{backgroundColor:"#6293ba"}}>
								<Card.Body>
									<h2 className="dash-cards-h2"> Profile</h2>
								</Card.Body>
							</Card>
						</Link>
					</div>
					<p id="type-line" className="animate-type" style={{color:"white"}}>{"< "}User: {auth.currentUser.email} {"/>"} </p>
				</div>
			</div>
		</>
	)
}
