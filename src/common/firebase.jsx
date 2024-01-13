// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTvGj0oNDRdaHysitWvS4t91SJutz7jhc",
  authDomain: "medium-clone-82f8c.firebaseapp.com",
  projectId: "medium-clone-82f8c",
  storageBucket: "medium-clone-82f8c.appspot.com",
  messagingSenderId: "425953730193",
  appId: "1:425953730193:web:752fafaea55840a5592930"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async()=>{

    let user = null;

    await signInWithPopup(auth, provider).then((result)=>{
     user = result.user   
    }).catch((err)=>{
        console.log(err);
    })

    return user;
}