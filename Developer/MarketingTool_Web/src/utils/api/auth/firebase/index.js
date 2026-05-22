// @third-party
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

// @project
import { AuthRole } from '@/enum';
import { attempt } from '@/utils/attempt';
import { firebaseAuth as auth } from '@/utils/auth-client/firebase';

/***************************  FIREBASE - LOGIN  ***************************/

export async function login(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await attempt(signInWithEmailAndPassword(auth, formData.email, formData.password));

      if (error || !data) {
        reject(new Error('Invalid credentials'));
        return;
      }

      const firebaseUser = data.user;

      if (!firebaseUser) {
        reject(new Error('Login failed'));
        return;
      }

      const token = await firebaseUser.getIdToken();

      resolve({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        access_token: token
      });
    } catch {
      reject(new Error('Server error'));
    }
  });
}

/***************************  FIREBASE - GET USER ***************************/

export function getUser() {
  return new Promise((resolve, reject) => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve({
            id: user.uid,
            email: user.email || '',
            role: AuthRole.USER,
            contact: '123456789',
            dialcode: '+1',
            firstname: 'John',
            lastname: 'Charly'
          });
        } else {
          reject(new Error('No user is signed in.'));
        }
      });
    } catch {
      reject(new Error('Server error'));
    }
  });
}

/***************************  FIREBASE - SIGN UP  ***************************/

export async function signUp(formData) {
  return new Promise((resolve, reject) => {
    try {
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then(() => {
          resolve({ status: 200 });
        })
        .catch((error) => {
          reject(new Error(error.message));
        });
    } catch {
      reject(new Error('Server error'));
    }
  });
}

/***************************  FIREBASE - VERIFY OTP  ***************************/

export function verifyOtp(formData) {
  console.log(formData);
  // Replace this with your actual firebase call to verify OTP
  return new Promise((resolve) => {
    resolve({ status: 200 });
  });
}

/***************************  FIREBASE - RESEND  ***************************/

export function resend(formData) {
  console.log(formData);
  // Replace this with your actual firebase call to resend OTP
  return new Promise((resolve) => {
    resolve({ status: 200 });
  });
}

/***************************  FIREBASE - FORGOT PASSWORD  ***************************/

export function forgotPassword(formData) {
  return new Promise((resolve, reject) => {
    try {
      sendPasswordResetEmail(auth, formData.email)
        .then(() => {
          resolve({ status: 200 });
        })
        .catch((error) => {
          reject(new Error(error.message));
        });
    } catch {
      reject(new Error('Server error'));
    }
  });
}

/***************************  FIREBASE - RESET PASSWORD  ***************************/

export function resetPassword(formData) {
  console.log(formData);
  // Replace this with your actual firebase call to reset password
  return new Promise((resolve) => {
    resolve({ status: 200 });
  });
}

/***************************  FIREBASE - SIGN OUT  ***************************/

export async function signOut() {
  return new Promise(async (resolve, reject) => {
    try {
      await auth.signOut();
      resolve({ status: 200 });
    } catch {
      reject(new Error('Server error'));
    }
  });
}

const firebaseAuth = { login, signUp, forgotPassword, resetPassword, resend, verifyOtp, signOut, getUser };

export default firebaseAuth;
