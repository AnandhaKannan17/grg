import client from '../utils/client';
import { GET_USER_PROFILE } from '../graphql/authQueries';

const BASE_URL = "/ALUMNI/loginandsignup";

// --- Low-level Fetch Services ---

export const loginWithEmailService = async ({ email, password }) => {
    try {
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch(`${BASE_URL}/loginwithpassword.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });

        const text = await response.text();
        let data;
        try {
            // Remove PHP notices from the start/end if they exist
            const jsonPart = text.match(/\{.*\}/);
            if (jsonPart) {
                data = JSON.parse(jsonPart[0]);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (e) {
            if (text.trim() === "1" || text.trim().toLowerCase() === "success") {
                data = { status: 'success' };
            } else {
                data = { status: 'error', message: text };
            }
        }

        // Logic for success: checking for 'auth' token or 'user_id'
        if (data.auth || data.user_id || data.status === 'success') {
            const token = data.auth || data.token;
            if (token) localStorage.setItem('token', token);

            // Normalize the user object
            const user = {
                id: data.user_id,
                email: data.email,
                username: data.user_name || data.userName || data.first_name,
                full_name: data.first_name + ' ' + (data.last_name || '')
            };
            localStorage.setItem('user', JSON.stringify(user));
            return { status: 'success', user };
        }

        return { status: 'error', message: data.message || 'Invalid credentials' };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const signupService = async (userData) => {
    try {
        const formData = new URLSearchParams();
        formData.append('userName', userData.name);
        formData.append('email', userData.email);
        formData.append('mobile', userData.mobile);
        formData.append('password', userData.password);

        const response = await fetch(`${BASE_URL}/signup.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });

        const text = await response.text();
        let data;
        try {
            const jsonPart = text.match(/\{.*\}/);
            if (jsonPart) {
                data = JSON.parse(jsonPart[0]);
            } else {
                // If it's just a number
                if (text.trim() === "1") return { status: 'success' };
                if (text.trim() === "2") return { status: 'error', message: 'User already exists' };
                data = { status: 'error', message: text };
            }
        } catch (e) {
            data = { status: 'error', message: text };
        }
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// --- High-level Auth Workflow Hooks/Functions ---

export const loginUser = async (email, password) => {
    const response = await loginWithEmailService({ email, password });
    return response.status === 'success';
};

export const registerUser = async (userData) => {
    const response = await signupService(userData);
    return response.status === 'success';
};

export const getUserData = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
};

// --- Legacy Support (Prevents Browser Cache Crashes) ---
export const verifyOtp = async () => ({ status: 'error', message: 'Service Disabled' });
export const verifyOtpService = async () => ({ status: 'error', message: 'Service Disabled' });
export const loginWithMobileService = async () => ({ status: 'error', message: 'Service Disabled' });
