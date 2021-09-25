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

  async function createDocument(collectionId, props) {
    return await app.database.createDocument(collectionId, props);
  }

  async function getDocument(collectionId, documentId) {
    return await app.database.getDocument(collectionId, documentId);
  }

  async function listDocuments(collectionId, filters) {
    return await app.database.listDocuments(collectionId, filters);
  }

  async function updateDocument(collectionId, documentId, props) {
    return await app.database.updateDocument(collectionId, documentId, props);
  }

  async function deleteDocument(collectionId, documentId) {
    return await app.database.deleteDocument(collectionId, documentId);
  }

  async function createFile(file, read, write) {
    return await app.storage.createFile(file, read, write);
  }

  async function getFile(fileId) {
    return await app.storage.getFile(fileId);
  }

  async function listFiles() {
    return await app.storage.listFiles();
  }

  async function getFilePreview(fileId) {
    return await app.storage.getFilePreview(fileId);
  }

  async function getFileDownload(fileId) {
    return await app.storage.getFileDownload(fileId);
  }

  async function getFileView(fileId) {
    return await app.storage.getFileView(fileId);
  }

  async function updateFile(fileId) {
    return await app.storage.updateFile(fileId);
  }

  async function deleteFile(fileId) {
    return await app.storage.deleteFile(fileId);
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
    createDocument,
    getDocument,
    listDocuments,
    updateDocument,
    deleteDocument,
    createFile,
    getFile,
    listFiles,
    getFilePreview,
    getFileDownload,
    getFileView,
    updateFile,
    deleteFile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
