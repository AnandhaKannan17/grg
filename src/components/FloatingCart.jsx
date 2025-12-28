import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import '../styles/FloatingCart.css';

const FloatingCart = () => {
    const { cart } = useContext(ShopContext);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {cart.length > 0 && (
                <motion.div
                    className="floating-cart"
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    <div className="floating-cart-info">
                        <div className="floating-cart-icon">
                            <ShoppingBag size={22} />
                            <span className="floating-cart-badge">{totalItems}</span>
                        </div>
                        <div className="floating-cart-details">
                            <span className="floating-cart-items">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                            <span className="floating-cart-total">Rs.{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <Link to="/cart" className="floating-cart-btn">
                        <span>View Cart</span>
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingCart;
