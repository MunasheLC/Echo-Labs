import React, { useState } from 'react'
// import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import {Helmet} from 'react-helmet';
// import Cards from './Cards';
// import Topnav from './Topnav';
import './Dashboard.css'
import { Card } from 'react-bootstrap';



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

const styles={
    backgroundColor: "#1c1f3e",
    width: "100vw",
    height: "100vh"
  }

  const cardsStyles={
    boxShadow: "15px 3px 20px -3px rgba(218, 156, 247, 0.363)",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    height: "81.75vh",
    width: "65vw",
    margin: "0 auto",
    top: "3vh",
    backgroundColor: "#383f75",
    borderRadius: "8px",
    border:"transparent"
  }

  const cardFull={
    boxShadow: "15px 3px 20px -3px rgba(218, 156, 247, 0.363)",
    position: "relative",
    display: "flex",
    flex:"wrap",
    justifyContent: "center",
    alignItems: "center",
    height: "81.75vh",
    width: "65vw",
    margin: "0 auto",
    top: "3vh",
    backgroundColor: "#383f75",
    borderRadius: "8px",
    border:"transparent"
  }

  const CardStyle={
    top: "8vh",
    border:"transparent",
    backgroundColor: "transparent",
  }

  const labCardStyles1={
    top: "15vh",
    position: "relative",
    marginLeft: "-60px",
    borderRadius: "20px",
    overflow: "hidden",
    left: "-5vw",
    boxShadow: "0 15px 25px rgba(0, 0, 0, 0.2)",
    transition: "0.5s",
    backgroundColor:"#7845d9", width:"15vw",height: "28vh",
  }
  const labCardStyles2={
    top: "-13vh",
    position: "relative",
    left: "8vw",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 25px rgba(0, 0, 0, 0.2)",
    transition: "0.5s",
    backgroundColor:"#7fb1ca", width:"15vw",height: "28vh",
  }
  const labCardStyles3={
    top: "-5vh",
    position: "relative",
    marginLeft: "-60px",
    borderRadius: "20px",
    overflow: "hidden",
    left: "-5vw",
    boxShadow: "0 15px 25px rgba(0, 0, 0, 0.2)",
    transition: "0.5s",
    backgroundColor:"#5c7fd3", width:"15vw",height: "28vh",
  }
  const labCardStyles4={
    top: "-33vh",
    position: "relative",
    marginLeft: "-60px",
    borderRadius: "20px",
    overflow: "hidden",
    left: "12vw",
    boxShadow: "0 15px 25px rgba(0, 0, 0, 0.2)",
    transition: "0.5s",
    backgroundColor:"#6293ba", width:"15vw",height: "28vh",
  }
    return (
     <>
    <body style={styles}>
    
    <div className="Dash-contain" style={{position:"relative", top:"50px"}}>

        <div className="animate__animated animate__bounceInRight" style={cardFull}>
            <Card style={{position:"relative", left:"-12vw",width:"20vw", height: "82vh",backgroundColor:"#2a315d"}}>
                <Card className="logo" style={{border: "transparent",backgroundColor:"transparent",width:"32vw",height:"56vh", top:"-9vh", left:"2vw"}}>
                    <Card.Body>
                        <div className= "echo-lines" style={{position:"relative",left: "-5vw", top:"25vh"}}>
                            <div className="animate__animated animate__bounceInDown" style={{backgroundColor:"white", width: "3px" ,height:"30px",position:"relative", left: "10.5vw",top: "-15vh"}}></div>
                            <div className="animate__animated animate__bounceInDown animate__delay-1s" style={{backgroundColor:"white", width: "3px" ,height:"30px" ,position:"relative", left: "11.5vw",top: "-20vh"}}></div>
                            <div className="animate__animated animate__bounceInDown animate__delay-2s" style={{backgroundColor:"white", width: "3px" ,height:"30px",position:"relative", left: "12.5vw",top: "-23vh"}}></div>
                        </div>
                    </Card.Body>
                </Card>

                <div className="circle" style={{borderRadius: "50%", width: "100px", height:"100px", backgroundColor:"#1f2647", boxShadow:"15px 3px 20px -3px rgba(218, 156, 247, 0.363)", margin:"0 auto", position:"relative", top:"-42vh"}}>
                    <i class="fas fa-user-secret fa-3x center" style={{position:"relative",top:"4vh",fontSize:"4.5rem",color:"white", width: "100%", textAlign:"center"}}></i>
                </div>

            </Card>

            <Card className="cards" style={CardStyle}>
            <Card.Body>
            <Card style={labCardStyles1}>
                <Link to='/test' className = 'lab-links' style={{textDecoration: "none"}}>
                    <Card.Body>
                        <h2 style={{color:"white", textAlign:"center", marginTop: "50px"}}> Lab Rooms</h2>
                    </Card.Body>
                </Link>
            </Card>

            <Card style={labCardStyles2}>
                <Link to='/test' className = 'lab-links' style={{textDecoration: "none"}}>
                    <Card.Body>
                        <h2 style={{color:"white", textAlign:"center", marginTop: "50px"}}> Join </h2>
                    </Card.Body>
                </Link>
            </Card>

            <Card style={labCardStyles3}>
                <Link to='/test' className = 'lab-links' style={{textDecoration: "none"}} >
                    <Card.Body>
                        <h2 style={{color:"white", textAlign:"center", marginTop: "50px"}}> Stats</h2>
                    </Card.Body>
                </Link>
            </Card>

            <Card style={labCardStyles4}>
                <Link to='/test' className = 'lab-links' style={{textDecoration: "none"}} >
                    <Card.Body>
                        <h2 style={{color:"white", textAlign:"center", marginTop: "50px"}}> Profile</h2>
                    </Card.Body>
                </Link>
            </Card>
            </Card.Body>
            </Card>
        </div>
        </div>

        </body>
    {/* <Topnav/>
    <Cards/> */}
     {/* <Card>
        <Card.Body>
        <h2 className = "text-center mb-4">Profile</h2>
        { error && <Alert variant="danger">{ error }</Alert> }
        <strong> Email:</strong> {currentUser.email}
        <Link to="/update-profile" className="btn btn-primary w-100 mt-3"> Update Profile </Link>
        </Card.Body>
    
     </Card>
     <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
            Logout
        </Button>
    
      </div> */}
    
     </>
    )
}
