import React, { useContext, useEffect, useState } from 'react'
import app from "../utils/appwrite"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {

  const [ currentUser, setCurrentUser ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  
  async function signup(email, password, name) {
    return await app.account.create(email, password, name)
  }

  async function login(email, password) {
    await app.account.createSession(email, password)
    return app.account.get()
      .then((res) => setCurrentUser(res))
      .then(() => setLoading(false))
      .catch(() => setCurrentUser(null, setLoading(false)))
  }

  async function logout() {
    return await app.account.deleteSession("current").then(() => setCurrentUser(null, setLoading(false)))
  }

  async function resetPassword(email) {
    return await app.account.createRecovery(email, process.env.REACT_APP_HOSTNAME + "/password-recovery")
  }

  async function confirmResetPassword(userId, secret, password, confirmPassword) {
    return await app.account.updateRecovery(userId, secret, password, confirmPassword)
  }

  async function updatePrefs(prefs) {
    currentUser.prefs = prefs
    return await app.account.updatePrefs(prefs)
  }

  
  useEffect((isActive) => {
    isActive = true;
    app.account.get()
      .then((res) => setCurrentUser(res))
      .then(() => setLoading(false))
      .catch(() => setCurrentUser(null, setLoading(false)))

    return () => {
      isActive = false;
    }
  }, [])
  
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    confirmResetPassword,
    updatePrefs,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
