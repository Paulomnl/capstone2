import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore'

const app = firebase.initializeApp({
  apiKey: "AIzaSyBfU6eSZgZNgBD2R4tNwgNAGZ3vR5A9CDE",
  authDomain: "capstone-b1415.firebaseapp.com",
  projectId: "capstone-b1415",
  storageBucket: "capstone-b1415.appspot.com",
  messagingSenderId: "644222514859",
  appId: "1:644222514859:web:026126365addf17faa69ee"
})

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = app.auth();
export const db = app.firestore();
export default app
