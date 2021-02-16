import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import './Login.css';




export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function signupHandler(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value)
      history.push("/")
    } catch {
      setError("Login Failed");
    }

    setLoading(false);
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
          <h1 className="animate__animated animate__bounceInLeft" style ={{color:"white", fontSize:"5.5rem", position: "relative", top: "10vh"}}>Echo</h1>
          <h1 className="animate__animated animate__jackInTheBox animate__delay-1s" style = {{color:"white",fontSize:"3.5rem", position: "relative",left:"10vw", top:"2vh"}} >Labs</h1>

          <div className= "echo-lines" style={{position:"relative",left: "20px"}}>
            <div className="animate__animated animate__bounceInDown" style={{backgroundColor:"white", width: "3px" ,height:"30px",position:"relative", left: "10.5vw",top: "-15vh"}}></div>
            <div className="animate__animated animate__bounceInDown animate__delay-1s" style={{backgroundColor:"white", width: "3px" ,height:"30px" ,position:"relative", left: "11.5vw",top: "-20vh"}}></div>
            <div className="animate__animated animate__bounceInDown animate__delay-2s" style={{backgroundColor:"white", width: "3px" ,height:"30px",position:"relative", left: "12.5vw",top: "-23vh"}}></div>
          </div>

          <p style={{color:"white",fontStyle:"italic", fontSize: "1.5rem", position:"relative", top:"-11vh"}}>Code Together</p>

        </Card.Body>
      </Card>
      
      <Card className="animate__animated animate__bounceInRight" style={{background: "#36393F ", borderRadius:"8px", boxShadow:"box-shadow: 6px 6px 20px rgba(122, 122, 122, 0.212)", position: "fixed",
                     top: "20vh", right: "13vw",  width: "32vw", height: "56vh"}}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{color:"white"}}>Sign Innnnnn</h2>
          {error && (
            <Alert variant="danger" style={{ textAlign: "center" }}>
              {" "}
              {error}{" "}
            </Alert>
          )}
          <Form onSubmit={signupHandler}>
            <Form.Group id="email">
              <Form.Label style={{color: "white"}}>Email</Form.Label>
              <Form.Control style={{ background: "#212121 ", color:"white"}} type="email" ref={emailRef} required />
            </Form.Group>

            <Form.Group id="password" style={{paddingBottom:"10px"}}>
              <Form.Label style={{color: "white"}}>Password</Form.Label>
              <Form.Control style={{ background: "#212121 ", color:"white"}} type="password" ref={passwordRef} required />
            </Form.Group>

            <Button disabled={loading} className="w-100" type="submit" style={{fontSize: "1.4rem"}}>
              Log In
            </Button>
          </Form>

          <div className = "w-100 text-center mt-3">
            <Link style={{color: "#7dcaf7", fontSize: "1.2rem"}} to="/forgot-password">Forgot password?</Link>
          </div>

          <div className="w-100 text-center mt-2" style={{color:"white", paddingTop: "2px"}}>
            Need an account? <Link style={{color: "#7dcaf7", fontSize: "1.2rem"}} to="/signup">Sign Up</Link>
          </div>

        </Card.Body>
      </Card>
      
    </body>
    </>
  );
}
