import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import AnimatedBackground from '../components/AnimatedBackground';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import '../styles/Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, placeOrder } = useContext(ShopContext);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 25;
    const total = subtotal + shipping;

    return (
        <div className="cart-page slide-in-up container">
            {/* Animated Background */}
            <AnimatedBackground variant="cart" />

            <h1 className="page-title">Shopping Cart</h1>

            {cart.length === 0 ? (
                <motion.div
                    className="empty-state-container"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className="empty-icon-wrapper">
                        <motion.div
                            className="empty-icon-bg"
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <ShoppingBag size={48} className="empty-icon" />
                    </div>
                    <h2 className="empty-title">Your cart is empty</h2>
                    <p className="empty-subtitle">Looks like you haven't added anything yet.<br />Start exploring and find something you love!</p>
                    <Link to="/" className="empty-cta">
                        <span>Start Shopping</span>
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div key={item.id} className="cart-item stagger-item" style={{ animationDelay: `${index * 0.08}s` }}>
                                <div className="item-img">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-info">
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p className="item-price">Rs.{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="q-btn">
                                                <Minus size={16} />
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="q-btn">
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary slide-in-right">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>Rs.{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `Rs.${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>Rs.{total.toFixed(2)}</span>
                        </div>
                        <button className="btn-primary checkout-btn" onClick={placeOrder}>
                            Place Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
