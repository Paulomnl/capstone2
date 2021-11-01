import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore'

const app = firebase.initializeApp({
  apiKey: "AIzaSyALU3UZB-fmqOdsRh7PUgspO5Gg0ND_5qI",
    authDomain: "auth-development-8cf2b.firebaseapp.com",
    projectId: "auth-development-8cf2b",
    storageBucket: "auth-development-8cf2b.appspot.com",
    messagingSenderId: "110637509097",
    appId: "1:110637509097:web:03f1370403ad7987b78378"
})

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = app.auth();
export const db = app.firestore();
export default app
