import React, { useState } from 'react'
import { Button, Card, Container, Alert } from 'react-bootstrap'

import { useAuth } from '../contexts/AuthContext'

export function Profile() {
  const { logout, currentUser } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  async function handleLogout() {
    try {
      setError("")
      await logout()
    } catch {
      setError("Failed to log out")
    }
    setLoading(false)
  }

  return (
    <>
    <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
      <div className="w-100" style={{maxWidth: "400px"}}>
        <Card>
          <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Button variant="link" disabled={loading} onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </Container>
  </>
  )
}
