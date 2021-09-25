import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PublicRoute({ component: Component, ...rest}) {
  const { currentUser } = useAuth()
  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? <Redirect to="/"/> : <Component {...props } />
      }}
    />
  ) 
}
