import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Truck, UserRound, Moon, Sun, X, LogOut } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { useShop } from '../shops-query';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';

import '../styles/Header.css';

const Header = () => {
  const { cart, wishlist, isDarkMode, toggleTheme, user, logout } = useContext(ShopContext);
  const { shopDetails } = useShop();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navLinks = [
    { path: '/wishlist', label: 'WISHLIST', icon: <Heart size={20} />, badge: wishlist.length },
    { path: '/cart', label: 'CART', icon: <ShoppingBag size={20} />, badge: cart.length },
    { path: '/orders', label: 'ORDERS', icon: <Truck size={20} /> },
  ];

  return (
    <>
      <header className="main-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <motion.div
              style={{ display: 'flex', alignItems: 'center' }}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              {(shopDetails?.name || 'STORE').split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="logo-text"
                  variants={{
                    initial: { opacity: 0, y: 10, filter: 'blur(8px)' },
                    animate: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      transition: {
                        delay: i * 0.04,
                        duration: 0.5,
                        ease: [0.2, 0.65, 0.3, 0.9]
                      }
                    },
                    hover: {
                      y: -3,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.div>
          </Link>

          <nav className="header-nav">
            <button onClick={toggleTheme} className="nav-item theme-toggle" aria-label="Toggle Theme">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
              >
                <div className="icon-wrapper">
                  {link.icon}
                  {link.badge > 0 && (
                    <span className="nav-badge">{link.badge}</span>
                  )}
                </div>
                <span className="nav-label">{link.label}</span>
              </Link>
            ))}

            {user ? (
              <div className="user-profile-section">
                <div className="user-avatar">
                  <UserRound size={18} />
                </div>
                <span className="user-name">{user.username || user.userName || 'User'}</span>
                <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="nav-item login-btn" onClick={() => setShowAuthModal(true)}>
                <UserRound size={20} />
                <span className="nav-label">LOGIN</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="logout-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              className="logout-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="logout-modal-icon">
                <LogOut size={32} />
              </div>
              <h3 className="logout-modal-title">Logout?</h3>
              <p className="logout-modal-text">Are you sure you want to logout from your account?</p>
              <div className="logout-modal-actions">
                <button
                  className="logout-modal-cancel"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="logout-modal-confirm"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    logout();
                  }}
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
