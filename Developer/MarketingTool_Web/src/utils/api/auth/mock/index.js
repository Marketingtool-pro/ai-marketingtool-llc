// @project
import mockUsers from './data';
import { AUTH_USER_KEY } from '@/config';

/***************************  MOCK - LOGIN  ***************************/

export async function login(formData) {
  return new Promise((resolve, reject) => {
    try {
      const user = mockUsers.find((user) => user.email === formData.email && user.password === formData.password);
      if (!user) {
        reject(new Error('Invalid email or password'));
        return;
      }

      resolve({
        id: user.id,
        email: user.email,
        access_token: user.access_token
      });
    } catch {
      reject(new Error('Server error'));
    }
  });
}

/***************************  MOCK - GET USER  ***************************/

export async function getUser() {
  return new Promise((resolve, reject) => {
    try {
      const storedValue = typeof window !== 'undefined' ? localStorage.getItem(AUTH_USER_KEY) : null;
      const parsedValue = storedValue && JSON.parse(storedValue);

      if (parsedValue?.access_token) {
        const user = mockUsers.find((user) => user.access_token === parsedValue.access_token);
        if (!user) {
          reject(new Error('Invalid token'));
          return;
        }

        resolve({
          id: user.id,
          email: user.email,
          role: user.role,
          contact: user.contact,
          dialcode: user.dialcode,
          firstname: user.firstname,
          lastname: user.lastname
        });
      } else {
        reject(new Error('Token not found'));
      }
    } catch {
      reject(new Error('Server error'));
    }
  });
}

/***************************  MOCK - SIGN UP  ***************************/

export async function signUp(formData) {
  return new Promise((resolve) => {
    console.log('signUp', formData);
    resolve({ status: 200 });
  });
}

/***************************  MOCK - VERIFY OTP  ***************************/

export async function verifyOtp(formData) {
  return new Promise((resolve) => {
    console.log('verifyOtp', formData);
    resolve({ status: 200 });
  });
}

/***************************  MOCK - RESEND OTP  ***************************/

export async function resend(formData) {
  return new Promise((resolve) => {
    console.log('resendOtp', formData);
    resolve({ status: 200 });
  });
}

/***************************  MOCK - FORGOT PASSWORD  ***************************/

export async function forgotPassword(formData) {
  return new Promise((resolve) => {
    console.log('forgotPassword', formData);
    resolve({ status: 200 });
  });
}

/***************************  MOCK - RESET PASSWORD  ***************************/

export async function resetPassword(formData) {
  return new Promise((resolve) => {
    console.log('resetPassword', formData);
    resolve({ status: 200 });
  });
}

/***************************  MOCK - SIGN OUT  ***************************/

export async function signOut() {
  return new Promise((resolve) => {
    resolve({ status: 200 });
  });
}

// Export as a single object for easy import
const mockAuth = { login, getUser, signUp, verifyOtp, resend, forgotPassword, resetPassword, signOut };

export default mockAuth;
