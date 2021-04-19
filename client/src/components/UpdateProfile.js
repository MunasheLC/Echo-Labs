import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const PasswordConfirmRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();


   function profileUpdateHandler(e) {
    e.preventDefault();

    /*include email verifiactation later*/

    if (passwordRef.current.value !== PasswordConfirmRef.current.value) {
      const msg = "Passwords do not match";
      console.log(msg);

      return setError(msg);
    }

    const promises = []
    setLoading(true);
    setError("");

    if(emailRef.current.value !== currentUser.email){
        promises.push(updateEmail(emailRef.current.value)) //If email is changed add it to the promise array, later add check to make sure the email isnt uesed
        
    }
    if(passwordRef.current.value){
        promises.push(updatePassword(passwordRef.current.value)) //If password is changed add it to the promise array

    }

    //runs after collecting all promises
    Promise.all(promises).then(() => {

        history.push("/dashboard")
     }).catch(() => {
         setError("Failed to update account")
     }).finally(() => {
         setLoading(false)
     })

  }

  return (
    <>
      <Card id="userinput-container">
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: "white" }}>Update Profile</h2>
          {error && (
            <Alert variant="danger" style={{ textAlign: "center" }}>
              {" "}
              {error}{" "}
            </Alert>
          )}
          <Form onSubmit={profileUpdateHandler}>
            <Form.Group id="email">
              <Form.Label style={{ color: "white" }}>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>

            <Form.Group id="password">
              <Form.Label style={{ color: "white" }}>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank if unchanged"
              />
            </Form.Group>

            <Form.Group id="psasword-confirm">
              <Form.Label style={{ color: "white" }}>Confirm Password</Form.Label>
              <Form.Control type="password" ref={PasswordConfirmRef} />
            </Form.Group>

          	<Button disabled={loading} className="w-100" type="submit">
              Update Profile
            </Button>

          </Form>
          <div className="w-100 text-center mt-2">
            <Link to="/dashboard" style={{ color: "white" }}> Back to Dashboard </Link>
          </div>

        </Card.Body>
      </Card>
    </>
  );
}
