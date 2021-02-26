import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"



export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const PasswordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()


   async function signupHandler (e) {
        e.preventDefault()

        /*include email verifiactation later*/

        if (passwordRef.current.value !== PasswordConfirmRef.current.value){

            const msg = "Passwords do not match"
            console.log(msg)
            
            return setError(msg)
    
        }
        try {
            setError("")
            setLoading(true)
         await signup(emailRef.current.value, passwordRef.current.value)
         history.push("/")
        } catch {
            setError("Account Creation Failed")
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
                <h2 className = "text-center mb-4" style={{color:"white"}}>Sign Up</h2>
                {error && <Alert variant="danger" style={{ textAlign: "center"}}> {error} </Alert>}
                <Form onSubmit={ signupHandler }>
                <Form.Group id="email">
                    <Form.Label style={{color:"white"}}>Email</Form.Label>
                    <Form.Control style={{ background: "#212121 ", color:"white"}} type="email" ref= {emailRef} required />
                </Form.Group>

                <Form.Group id="password">
                    <Form.Label style={{color:"white"}}>Password</Form.Label>
                    <Form.Control style={{ background: "#212121 ", color:"white"}} type="password" ref= {passwordRef} required />
                </Form.Group>

                <Form.Group id="psasword-confirm">
                    <Form.Label style={{color:"white"}} >Confirm Password</Form.Label>
                    <Form.Control style={{ background: "#212121 ", color:"white"}} type="password" ref= {PasswordConfirmRef} required />
                </Form.Group>
                <Button style={{fontSize: "1.4rem"}} disabled= { loading } className="w-100" type="submit">Sign Up</Button>
            </Form>
            <div className = "w-100 text-center mt-3">
                <Link className="items" to="/forgot-password">Forgot password?</Link>
            </div>

            <div className = "w-100 text-center mt-2" style={{color:"white"}}>
                Already have an Account? <Link className="items" to="/login"> Log in </Link>
            </div>

            </Card.Body>
        </Card>
        </body>
    </>
    )
}
