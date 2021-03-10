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


    document.body.style.backgroundColor = "transparent";
    document.body.style.background="linear-gradient(120deg, rgba(0, 0, 0, 0) 30%, #7845d9 40%),url('https://www.toptal.com/designers/subtlepatterns/patterns/double-bubble-dark.png')";
    return (
    <>
    <div className='logo' style={{position:"fixed", marginTop:"20vh", marginLeft:"8vw",padding: "10vh",maxWidth:"25vw", float:"left", color:"white"}}>
          <div className="logo-name">

            <div className="echo-lines" style={{float: "right"}}>
              <div id="x" className="animate__animated animate__bounceInDown"></div>
              <div id="y" className="animate__animated animate__bounceInDown animate__delay-1s"></div>
              <div id="z" className="animate__animated animate__bounceInDown animate__delay-2s"></div>
            </div>

          <h1 className="animate__animated animate__bounceInLeft" style={{}}>Echo</h1>
          <h1 className="animate__animated animate__jackInTheBox animate__delay-1s" style={{}}>Labs</h1>
          
          </div>

          <p className="title" style={{}}>Code Together</p>

      </div>

      <Card id="login-container" className="animate__animated animate__bounceInRight">
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
                Back to <Link className="items" to="/login"> Log in? </Link>
            </div>
            </Card.Body>
        </Card>
        </>
    )
}
