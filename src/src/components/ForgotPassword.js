import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"



export default function Signup() {
    const emailRef = useRef()
    // const passwordRef = useRef()
    // const PasswordConfirmRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
 

   async function resetHandler (e) {
        e.preventDefault()

        

        try {
            setMessage("")
            setError("")
            setLoading(true)
            // console.log(emailRef.current.value) check to see the correct email is loading
         await resetPassword(emailRef.current.value)
         setMessage("Check your inbox for further instructions")
        } catch {
            setError("Failed to reset password")
        }

        setLoading(false)
    }

    const styles={
        backgroundColor: "transparent",
        background: "linear-gradient(120deg, rgba(0, 0, 0, 0) 30%, #7845d9 40%),url('https://www.toptal.com/designers/subtlepatterns/patterns/double-bubble-dark.png')",
        width: "100vw",
        height: "100vh"
    }

    return (
    <>
    <body style={styles}>
      <Card className='logo' style={{border: "transparent",backgroundColor:"transparent",width:"32vw",height:"56vh", top:"20vh", left:"8vw"}}>
        <Card.Body>
          <h1 className="" style ={{color:"white", fontSize:"5.5rem", position: "relative", top: "10vh"}}>Echo</h1>
          <h1 className="" style = {{color:"white",fontSize:"3.5rem", position: "relative",left:"10vw", top:"2vh"}} >Labs</h1>

          <div className= "echo-lines" style={{position:"relative",left: "20px"}}>
            <div className="animate__animated animate__bounceInDown" style={{backgroundColor:"white", width: "3px" ,height:"30px",position:"relative", left: "10.5vw",top: "-15vh"}}></div>
            <div className="animate__animated animate__bounceInDown animate__delay-1s" style={{backgroundColor:"white", width: "3px" ,height:"30px" ,position:"relative", left: "11.5vw",top: "-20vh"}}></div>
            <div className="animate__animated animate__bounceInDown animate__delay-2s" style={{backgroundColor:"white", width: "3px" ,height:"30px",position:"relative", left: "12.5vw",top: "-23vh"}}></div>
          </div>

          <p style={{color:"white",fontStyle:"italic", fontSize: "1.5rem", position:"relative", top:"-11vh"}}>Code Together</p>

        </Card.Body>
      </Card>

        <Card style={{background: "#36393F ", borderRadius:"8px", position: "fixed", top: "20vh", right: "13vw",
                      width: "32vw",boxShadow:"box-shadow: 6px 6px 20px rgba(122, 122, 122, 0.212)", height:"65vh"}}>
            <Card.Body>
                <h2 className = "text-center mb-4" style={{color:"white"}}>Password Reset</h2>
                {error && <Alert variant="danger" style={{ textAlign: "center"}}> {error} </Alert>}
                {message && <Alert variant="success" style={{ textAlign: "center"}}> {error} </Alert>}
                <Form onSubmit={ resetHandler }>
                <Form.Group id="email">
                    <Form.Label style={{color:"white"}}>Email</Form.Label>
                    <Form.Control type="email" ref= {emailRef} required />
                </Form.Group>

                {/* <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref= {passwordRef} required />
                </Form.Group>

                <Form.Group id="password-confirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" ref= {PasswordConfirmRef} required />
                </Form.Group> */}
                <Button disabled= { loading } className="w-100" type="submit">Reset Password</Button>
            </Form>

            <div className = "w-100 text-center mt-2" style={{color:"white"}}>
                Back to <Link to="/login"> Log in? </Link>
            </div>
            </Card.Body>
        </Card>
    </body>
    </>
    )
}
