import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, Phone, KeyRound, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { loginUser, registerUser } from '../shops-query/modules/auth';
import { useToast } from '../context/ToastContext';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const { showToast } = useToast();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Forgot password flow states
    const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
    const [forgotPasswordData, setForgotPasswordData] = useState({
        mobile: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });

    // Reset form when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            setFormData({ name: '', email: '', mobile: '', password: '' });
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                const success = await loginUser(formData.email, formData.password);
                if (success) {
                    showToast('Login successful! Welcome back.', 'success');
                    onClose();
                    window.location.reload();
                } else {
                    const errMsg = 'Login failed. Please check your credentials.';
                    setError(errMsg);
                    showToast(errMsg, 'error');
                }
            } else {
                const success = await registerUser(formData);
                if (success) {
                    showToast('Account created successfully! Please sign in.', 'success');
                    setIsLogin(true);
                    setError('Signup success! Please login.');
                } else {
                    const errMsg = 'Signup failed. User may already exist.';
                    setError(errMsg);
                    showToast(errMsg, 'error');
                }
            }
        } catch (err) {
            const errMsg = err.message.includes('<!DOCTYPE') ? 'Server error. Please try again.' : 'An error occurred. Please try again.';
            setError(errMsg);
            showToast(errMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleForgotPasswordInputChange = (e) => {
        setForgotPasswordData({
            ...forgotPasswordData,
            [e.target.name]: e.target.value
        });
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ name: '', email: '', mobile: '', password: '' });
        setForgotPasswordStep(0);
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setForgotPasswordStep(1);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('Forgot password is not available currently.');
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('Verification service unavailable.');
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (forgotPasswordData.newPassword === forgotPasswordData.confirmPassword) {
            console.log('Password reset successful');
            setForgotPasswordStep(0);
            setForgotPasswordData({ mobile: '', otp: '', newPassword: '', confirmPassword: '' });
        }
    };

    const handleBackToLogin = () => {
        setForgotPasswordStep(0);
        setError('');
        setForgotPasswordData({ mobile: '', otp: '', newPassword: '', confirmPassword: '' });
    };

    // Render forgot password steps
    const renderForgotPasswordFlow = () => {
        switch (forgotPasswordStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="forgot-password-flow"
                    >
                        <button type="button" className="back-btn" onClick={handleBackToLogin}>
                            <ArrowLeft size={18} />
                            <span>Back to Login</span>
                        </button>
                        <div className="auth-header forgot-header">
                            <div className="forgot-icon">
                                <Phone size={28} />
                            </div>
                            <h2 className="auth-title">Forgot Password</h2>
                            <p className="auth-subtitle">Enter your mobile number to receive OTP</p>
                            {error && <div className="auth-error-message">{error}</div>}
                        </div>
                        <form onSubmit={handleSendOtp} className="auth-form">
                            <div className="input-group">
                                <div className="input-icon">
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="Mobile Number"
                                    value={forgotPasswordData.mobile}
                                    onChange={handleForgotPasswordInputChange}
                                    required
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                />
                            </div>
                            <motion.button
                                type="submit"
                                className="auth-submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                <span>{isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Send OTP'}</span>
                                <ArrowRight size={18} />
                            </motion.button>
                        </form>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="forgot-password-flow"
                    >
                        <button type="button" className="back-btn" onClick={() => setForgotPasswordStep(1)}>
                            <ArrowLeft size={18} />
                            <span>Back</span>
                        </button>
                        <div className="auth-header forgot-header">
                            <div className="forgot-icon">
                                <KeyRound size={28} />
                            </div>
                            <h2 className="auth-title">Verify OTP</h2>
                            <p className="auth-subtitle">Enter the OTP sent to +91 {forgotPasswordData.mobile}</p>
                            {error && <div className="auth-error-message">{error}</div>}
                        </div>
                        <form onSubmit={handleVerifyOtp} className="auth-form">
                            <div className="otp-input-container">
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter OTP"
                                    value={forgotPasswordData.otp}
                                    onChange={handleForgotPasswordInputChange}
                                    required
                                    maxLength={6}
                                    className="otp-input"
                                />
                            </div>
                            <div className="resend-otp">
                                <span>Didn't receive OTP?</span>
                                <button type="button" onClick={() => handleSendOtp({ preventDefault: () => { } })}>Resend</button>
                            </div>
                            <motion.button
                                type="submit"
                                className="auth-submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                <span>{isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Verify OTP'}</span>
                                <ArrowRight size={18} />
                            </motion.button>
                        </form>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="forgot-password-flow reset-password-modal"
                    >
                        <div className="auth-header forgot-header">
                            <div className="forgot-icon success">
                                <CheckCircle size={28} />
                            </div>
                            <h2 className="auth-title">Create New Password</h2>
                            <p className="auth-subtitle">Your new password must be different from previous one</p>
                        </div>
                        <form onSubmit={handleResetPassword} className="auth-form">
                            <div className="input-group">
                                <div className="input-icon">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={forgotPasswordData.newPassword}
                                    onChange={handleForgotPasswordInputChange}
                                    required
                                    minLength={6}
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="input-group">
                                <div className="input-icon">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={forgotPasswordData.confirmPassword}
                                    onChange={handleForgotPasswordInputChange}
                                    required
                                    minLength={6}
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {forgotPasswordData.newPassword && forgotPasswordData.confirmPassword &&
                                forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword && (
                                    <p className="password-mismatch">Passwords do not match</p>
                                )}
                            <motion.button
                                type="submit"
                                className="auth-submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword}
                            >
                                <span>Reset Password</span>
                                <ArrowRight size={18} />
                            </motion.button>
                        </form>
                        <div className="auth-switch">
                            <button type="button" onClick={handleBackToLogin}>Back to Login</button>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="auth-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="auth-modal"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        <div className="auth-bg-animation">
                            <div className="floating-orb orb-1"></div>
                            <div className="floating-orb orb-2"></div>
                            <div className="floating-orb orb-3"></div>
                            <div className="floating-orb orb-4"></div>
                            <div className="floating-shape shape-1"></div>
                            <div className="floating-shape shape-2"></div>
                            <div className="glow-effect glow-1"></div>
                            <div className="glow-effect glow-2"></div>
                        </div>
                        <button className="auth-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                        <AnimatePresence mode="wait">
                            {forgotPasswordStep > 0 ? (
                                renderForgotPasswordFlow()
                            ) : (
                                <motion.div
                                    key="auth-form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="auth-header">
                                        <motion.div
                                            className="auth-logo"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring" }}
                                        >
                                            <span className="logo-dot"></span>
                                        </motion.div>
                                        <motion.h2
                                            key={isLogin ? 'login' : 'signup'}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="auth-title"
                                        >
                                            {isLogin ? 'Welcome Back' : 'Create Account'}
                                        </motion.h2>
                                        <p className="auth-subtitle">
                                            {isLogin ? 'Sign in to continue shopping' : 'Join us for the best shopping experience'}
                                        </p>
                                        {error && <div className="auth-error-message">{error}</div>}
                                    </div>
                                    <form onSubmit={handleSubmit} className="auth-form">
                                        <AnimatePresence mode="wait">
                                            {!isLogin && (
                                                <motion.div
                                                    className="input-group"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="input-icon">
                                                        <User size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        placeholder="Full Name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required={!isLogin}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div className="input-group">
                                            <div className="input-icon">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            //autoComplete="off"
                                            />
                                        </div>
                                        <AnimatePresence mode="wait">
                                            {!isLogin && (
                                                <motion.div
                                                    className="input-group"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    <div className="input-icon">
                                                        <Phone size={18} />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        name="mobile"
                                                        placeholder="Mobile Number"
                                                        value={formData.mobile}
                                                        onChange={handleInputChange}
                                                        required={!isLogin}
                                                        pattern="[0-9]{10}"
                                                        maxLength={10}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div className="input-group">
                                            <div className="input-icon">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                                autoComplete="new-password"
                                            />
                                            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {isLogin && (
                                            <div className="forgot-password">
                                                <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
                                            </div>
                                        )}
                                        <motion.button
                                            type="submit"
                                            className="auth-submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isLoading}
                                        >
                                            <span>
                                                {isLoading ? <Loader2 className="animate-spin" size={18} /> :
                                                    isLogin ? 'Sign In' : 'Create Account'}
                                            </span>
                                            <ArrowRight size={18} />
                                        </motion.button>
                                    </form>
                                    <div className="auth-switch">
                                        <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                                        <button type="button" onClick={switchMode}>
                                            {isLogin ? 'Sign Up' : 'Sign In'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
