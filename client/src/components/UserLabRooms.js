import React, { useState } from 'react'
import { Button} from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import LabRoom from "./getUserLabRooms"
import { getUserPermissions } from './Admin'
import './Dashboard.css'

export default function UserLabRooms() {
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
	document.body.style.backgroundColor="#1c1f3e";

	function adminCheck(){
		getUserPermissions().then((value) => { if (value === true){ document.getElementById('perm').style.display = 'block'; } // if the promise results to true show the user the createLabRoom option in navbar
	})
}
	return(
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
							<Link to='/dashboard' style={{}}>
								<Button variant="link">
									<h2 className="Button-text-1"> Dashboard</h2>
								</Button>
							</Link>

							<Link id="perm" to='CreateLabRoom' style={{display: "none"}}><Button variant="link"><h2 className="Button-text-1"> Create Lab Room </h2></Button></Link>
							{adminCheck()}

							<Button variant="info" onClick={handleLogout}>
							<h2 className="Button-text-1"> Logout</h2>
							</Button>
						</ul>
					</div>

				</div>

				<div id="dash-card-container">  
					<h2 className="h2-heading">Lab Rooms </h2>         
					<LabRoom/>
				</div>

			</div>
		</>
	)
}

