import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Truck, UserRound, Moon, Sun } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import AuthModal from './AuthModal';

import '../styles/Header.css';

const Header = () => {
  const { cart, wishlist, isDarkMode, toggleTheme } = useContext(ShopContext);
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
            ESSIENCE
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

            <button className="nav-item login-btn" onClick={() => setShowAuthModal(true)}>
              <UserRound size={20} />
              <span className="nav-label">LOGIN</span>
            </button>
          </nav>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Header;
