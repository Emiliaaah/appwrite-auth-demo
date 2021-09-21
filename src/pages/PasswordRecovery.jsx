import React, { useRef, useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { Redirect } from 'react-router'
import { Link } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'

export function PasswordRecovery(props) {
  const { confirmResetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const passwordRef = useRef("");
  const passwordConfirmationRef = useRef("");
  const urlParams = new URLSearchParams(props.location.search);

  if (!urlParams.get("userId") || !urlParams.get("secret")) return <Redirect to="/forgot-password"/>

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await confirmResetPassword(urlParams.get("userId"), urlParams.get("secret"), passwordRef.current.value, passwordConfirmationRef.current.value)
      setMessage("Successfully changed your password, ")
    } catch (err) {
      console.log(err)
      setError("Failed to reset password")
    }
    setLoading(false)
  }

  return (
    <>
    <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
      <div className="w-100" style={{maxWidth: "400px"}}>
        <Card>
          <Card.Body>
          <h2 className="text-center mb-4">Password Recovery</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}<Link to="/login">Login</Link></Alert>}
          <Form>
            <Form.Group id="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password" className="mb-3">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmationRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit" onClick={handleSubmit}>Reset password</Button>
          </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  </>
  )
}
