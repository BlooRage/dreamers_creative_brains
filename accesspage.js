import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { 
  getAuth, 
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';
import { 
  getFirestore, 
  getDoc, 
  doc 
} from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: 'AIzaSyCTGmBZWlDPXKnXakM5V7SQgpy4Vlq2ZDo',
    authDomain: 'admin-dreamers.firebaseapp.com',
    projectId: 'admin-dreamers',
    storageBucket: 'admin-dreamers.appspot.com',
    messagingSenderId: '1046064722232',
    appId: '1:1046064722232:web:4486dec3d77407f3a851cd'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Prevent back button after logout
history.pushState(null, null, location.href);
window.addEventListener('popstate', function () {
    if (!localStorage.getItem('loggedInUserId')) {
        alert("You need to login first!");
        window.location.href = '../index.html';
    }
});

// Check authentication state
onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('loggedUserLName').innerText = userData.lastName;
                document.getElementById('loggedUserFName').innerText = userData.firstName;
                document.getElementById('loggedUserID').innerText = userData.id;
            } else {
                console.log("No document found matching ID");
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });
    } else {
        alert("You need to login first!");
        window.location.href = '../index.html';
    }
});

// Logout Function
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth)
    .then(() => {
        localStorage.removeItem('loggedInUserId'); // Remove after sign out
        alert("Logout successful!"); // Show logout success message
        window.location.href = '../index.html';
    })
    .catch((error) => {
        console.error('Error Signing out:', error);
    });
});
