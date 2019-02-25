import firebase from 'firebase'
import 'firebase/firestore'
var config = {
  apiKey: "AIzaSyCZLO3LeY8QishNohzK2KgCz1GFfKJPoBs",
  authDomain: "projectcp3170-1543125480321.firebaseapp.com",
  databaseURL: "https://projectcp3170-1543125480321.firebaseio.com",
  projectId: "projectcp3170-1543125480321",
  storageBucket: "projectcp3170-1543125480321.appspot.com",
  messagingSenderId: "543299455580"
};
firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
export default db;