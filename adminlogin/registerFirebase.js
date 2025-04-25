// Import Firebase SDK functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  sendEmailVerification 
} from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';
import { 
  getFirestore, 
  setDoc, 
  getDoc, 
  doc 
} from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';

// 🔹 Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCTGmBZWlDPXKnXakM5V7SQgpy4Vlq2ZDo',
  authDomain: 'admin-dreamers.firebaseapp.com',
  projectId: 'admin-dreamers',
  storageBucket: 'admin-dreamers.firebasestorage.app',
  messagingSenderId: '1046064722232',
  appId: '1:1046064722232:web:4486dec3d77407f3a851cd'
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// 🔹 REGISTER USER
document.getElementById('submitRegister').addEventListener('click', async (event) => {
  event.preventDefault();

  // Get form values
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('create-password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();
  const firstName = document.getElementById('register-firstname').value.trim();
  const lastName = document.getElementById('register-lastname').value.trim();
  const id = document.getElementById('register-id').value.trim();
  const role = document.getElementById('register-role').value;

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const idRegex = /^\d+$/;

  // Validate input fields
  if (!email || !password || !confirmPassword || !firstName || !lastName || !id || !role) {
    alert('All fields are required!');
    return;
  }
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address!');
    return;
  }
  if (!idRegex.test(id)) {
    alert('ID must contain only numbers!');
    return;
  }
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  if (!passwordRegex.test(password)) {
    alert('Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.');
    return;
  }

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);
    alert('Verification email sent! Please check your inbox.');

    // Store user info in Firestore
    const userData = { id, email, firstName, lastName, role, emailVerified: false };
    await setDoc(doc(db, 'users', user.uid), userData);

    alert('Account created successfully! Please verify your email before logging in.');
    setTimeout(() => window.location.href = 'adminLogin.html', 1000);

  } catch (error) {
    console.error('Error:', error.message);
    alert(error.message.includes('email-already-in-use') ? 'Email already exists!' : 'Unable to create account.');
  }
});

// 🔹 SIGN IN USER WITH ROLE-BASED REDIRECTION
document.getElementById('submitSignIn').addEventListener('click', async (event) => {
  event.preventDefault();

  const email = document.getElementById('login-credential').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    alert('Please enter both email and password!');
    return;
  }
  if (!emailRegex.test(email)) {
    alert('Enter a valid email address!');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert('Please verify your email before logging in.');
      return;
    }

    // Fetch user role from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      alert('User data not found! Please contact support.');
      return;
    }

    const userData = userDoc.data();
    localStorage.setItem('loggedInUserId', user.uid);
    
    // Role-based redirection
    const roleRedirects = {
      Registrar: '../principalportal/pnc.html',
      Cashier: '../principalportal/pnc.html',
      Principal: '../principalportal/pnc.html',
      Administrator: '../principalportal/pnc.html'
    };

    const redirectURL = roleRedirects[userData.role] || 'homepage.html';

    alert('Login successful!');
    setTimeout(() => window.location.href = redirectURL, 500);

  } catch (error) {
    console.error('Error:', error.message);
    alert(
      error.message.includes('user-not-found') ? 'Account does not exist!' :
      error.message.includes('wrong-password') ? 'Incorrect email or password!' :
      'Login failed! Please try again.'
    );
  }
});

// 🔹 FORGOT PASSWORD
document.getElementById('submitForgotPassword').addEventListener('click', async (event) => {
  event.preventDefault();

  const email = document.getElementById('forgot-password-email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    alert('Please enter your email address.');
    return;
  }
  if (!emailRegex.test(email)) {
    alert('Enter a valid email address!');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent! Check your inbox.');
    window.location.href = 'adminLogin.html';
  } catch (error) {
    console.error('Error:', error.message);
    alert(`Error: ${error.message}`);
  }
});
