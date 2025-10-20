
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyDtq1vLVZ9D3CBis6FFSpt8psERGyTG6YM",
  authDomain: "gen-z-airdrop.firebaseapp.com",
  databaseURL: "https://gen-z-airdrop-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gen-z-airdrop",
  storageBucket: "gen-z-airdrop.appspot.com",
  messagingSenderId: "1056087088959",
  appId: "1:1056087088959:web:2d15418429c2f378f2bd8a",
  measurementId: "G-CKB3HP9D31"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const database = firebase.database();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export default firebase;
