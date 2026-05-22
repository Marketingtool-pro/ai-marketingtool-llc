// @project
import { AuthRole } from '@/enum';
import axiosServices from '@/utils/axios';
import { generateId } from '@/utils/common';

function handleAxiosError(error) {
  const axiosError = error;

  if (axiosError.response) {
    return new Error(axiosError.response.data?.message || 'Request failed.');
  }

  return new Error(axiosError.message || 'Server error');
}

/***************************  JWT - LOGIN  ***************************/

export async function login(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Example API call — update URL and data fields as per your backend.
      const response = await axiosServices.post('/api/account/login', {
        email: formData.email,
        password: formData.password
      });

      const data = response.data;

      // Map response fields based on your backend structure.
      resolve({
        id: data.user?.id,
        email: data.user?.email || '',
        access_token: data.serviceToken
      });
    } catch (error) {
      reject(handleAxiosError(error));
    }
  });
}

/***************************  JWT - GET USER  ***************************/

export async function getUser() {
  return new Promise(async (resolve, reject) => {
    try {
      // Example API call — update URL as per your backend.
      const response = await axiosServices.get('/api/account/me');
      const data = response.data;

      // Map response fields based on your backend structure.
      resolve({
        id: data.user.id,
        email: data.user.email || '',
        role: AuthRole.USER,
        contact: '123456789',
        dialcode: '+1',
        firstname: 'John',
        lastname: 'Charly'
      });
    } catch (error) {
      reject(handleAxiosError(error));
    }
  });
}

/***************************  JWT - SIGN UP  ***************************/

export async function signUp(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = generateId();

      // Example API call — update URL and data fields as per your backend.
      await axiosServices.post('/api/account/register', {
        id,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstname,
        lastName: formData.lastname
      });
      resolve({ status: 200 });
    } catch (error) {
      reject(handleAxiosError(error));
    }
  });
}

/***************************  JWT - VERIFY OTP  ***************************/

export async function verifyOtp(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Replace this with your actual API call to verify OTP
      console.log('verifyOtp', formData);
      resolve({ status: 200 });
    } catch (error) {
      reject(handleAxiosError(error));
    }
  });
}

/***************************  JWT - RESEND OTP  ***************************/

export async function resend(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Replace this with your actual API call to resend OTP
      console.log('resendOtp', formData);
      resolve({ status: 200 });
    } catch (error) {
      reject(handleAxiosError(error));
    }
  });
}

/***************************  JWT - FORGOT PASSWORD  ***************************/

export async function forgotPassword(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Replace this with your actual API call to forgot password
      console.log('forgotPassword', formData);
      resolve({ status: 200 });
    } catch (error) {
      reject(handleAxiosError(error));
    }
  });
}

/***************************  JWT - RESET PASSWORD  ***************************/

export async function resetPassword(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Replace this with your actual API call to reset password
      console.log('resetPassword', formData);
      resolve({ status: 200 });
    } catch (error) {
      reject(handleAxiosError(error));
    }
  });
}

/***************************  JWT - SIGN OUT  ***************************/

export async function signOut() {
  return new Promise(async (resolve, reject) => {
    try {
      resolve({ status: 200 });
    } catch {
      reject(new Error('Server error'));
    }
  });
}

// Export as a single object for easy import
const jwtAuth = { login, getUser, signUp, verifyOtp, resend, forgotPassword, resetPassword, signOut };

export default jwtAuth;
