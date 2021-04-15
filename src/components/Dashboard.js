import React, { useState } from 'react'
import { Button} from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { Card } from 'react-bootstrap';
import {auth} from '../firebase';
import { getUserPermissions} from './Admin'
import './Dashboard.css'

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
		getUserPermissions().then((value) => { if (value === true){ document.getElementById('permission').innerHTML = "Admin"; } // if the promise results to true , display Admin on their dashboard
	})}

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

				<div id="dash-card-container">
					<div id="row">               
						<Card id="lab-card-style-1" style={{backgroundColor:"#7845d9"}}>
							<Link to='/user-lab-rooms' className = 'lab-links' style={{textDecoration: "none"}}>
								<Card.Body>
									<h2 className="dash-cards-h2"> Lab Rooms</h2>
								</Card.Body>
							</Link>
						</Card>

						<Card id="lab-card-style-1" style={{backgroundColor:"#7fb1ca"}}>
							<Link to='/join' className = 'lab-links' style={{textDecoration: "none"}}>
								<Card.Body>
									<h2 className="dash-cards-h2"> Join </h2>
								</Card.Body>
							</Link>
						</Card>

						<Card id="lab-card-style-1" style={{backgroundColor:"#5c7fd3"}}>
							<Link to='/test' className = 'lab-links' style={{textDecoration: "none"}} >
								<Card.Body>
									<h2 className="dash-cards-h2"> Stats</h2>
								</Card.Body>
							</Link>
						</Card>


						<Card id="lab-card-style-1" style={{backgroundColor:"#6293ba"}}>
							<Link to='/update-profile' className= 'lab-links' style={{textDecoration: "none"}} >
								<Card.Body>
									<h2 className="dash-cards-h2"> Profile</h2>
								</Card.Body>
							</Link>
						</Card>
					</div>
					<p id="type-line" className="animate-type" style={{color:"white"}}>{"< "}User: {auth.currentUser.email} {"/>"} </p>
				</div>
			</div>
		</>
	)
}
