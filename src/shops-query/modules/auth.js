const BASE_URL = "/ALUMNI/loginandsignup";

export const verifyMobileService = async (mobile) => {
    try {
        const response = await fetch(`${BASE_URL}/verifymobilenumber.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mobile }),
        });
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const loginWithMobileService = async (mobile) => {
    try {
        const response = await fetch(`${BASE_URL}/loginwithmobile.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mobile }),
        });
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const verifyOtpService = async ({ mobile, otp }) => {
    try {
        const response = await fetch(`${BASE_URL}/verifyotp.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mobile, otp }),
        });
        const data = await response.json();
        if (data.status === 'success' && data.token) {
            localStorage.setItem('token', data.token);
            // Optionally store user details
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        }
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const signupService = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/signup.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};
