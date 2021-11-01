import React, { useContext, useState, useEffect } from "react"
import { auth, db, provider } from "../firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password).then(cred => {
      db.collection('users').doc(cred.user.uid).set({
        id: cred.user.uid,
        role: 'admin'
      });
    });
  }

  function userSignup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password).then(cred => {
      db.collection('users').doc(cred.user.uid).set({
        id: cred.user.uid,
        role: 'user'
      });
    });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function loginWithGoogle() {
    return auth.signInWithPopup(provider);
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    userSignup,
    loginWithGoogle
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
