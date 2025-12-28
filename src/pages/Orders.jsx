import React, { useContext } from 'react';
import { useOrders, useShop } from '../shops-query';
import { ShopContext } from '../context/ShopContext';
import AnimatedBackground from '../components/AnimatedBackground';
import { Package, ArrowRight, Loader2, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import '../styles/Orders.css';

const Orders = () => {
    const { user } = useContext(ShopContext);
    const { orders: rawOrders, loading, error } = useOrders(user?.id);
    const { shopDetails } = useShop();

    // Map raw orders to the structure expected by the UI
    const orders = (rawOrders || []).map(order => {
        // Calculate total amount from all order details
        const totalAmount = order.orderdetails?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;

        // Use the status from the first order detail item as the overall status
        const displayStatus = order.orderdetails?.[0]?.status === 1 ? 'Processing'
            : order.orderdetails?.[0]?.status === 0 ? 'Pending'
                : order.orderdetails?.[0]?.status === 4 ? 'Delivered'
                    : 'Processing';

        return {
            id: order.id,
            timestamp: order.timestamp,
            totalAmount,
            status: displayStatus,
            items: (order.orderdetails || []).map(item => ({
                productName: item.Products?.[0]?.name || 'Unknown Product',
                quantity: item.quantity,
                price: (item.totalPrice / item.quantity) || item.totalPrice
            }))
        };
    });

    if (loading && user) {
        return (
            <div className="orders-page flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error && user) {
        return (
            <div className="orders-page flex items-center justify-center min-h-screen">
                <p className="text-red-500">Error loading orders: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="orders-page slide-in-up container">
            {/* Animated Background */}
            <AnimatedBackground variant="orders" />

            <h1 className="page-title">My Orders</h1>
            {shopDetails && <p className="page-subtitle">From {shopDetails.name}</p>}

            {!user ? (
                <motion.div
                    className="empty-state-container"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="empty-icon-wrapper">
                        <UserRound size={48} className="empty-icon" />
                    </div>
                    <h2 className="empty-title">Please login</h2>
                    <p className="empty-subtitle">Login to your account to view your order history and track your packages.</p>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="empty-cta">
                        <span>Sign In Now</span>
                        <ArrowRight size={18} />
                    </button>
                </motion.div>
            ) : orders.length === 0 ? (
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
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <Package size={48} className="empty-icon" />
                    </div>
                    <h2 className="empty-title">No orders yet</h2>
                    <p className="empty-subtitle">When you place an order, it will appear here.<br />Start shopping to see your order history!</p>
                    <Link to="/" className="empty-cta">
                        <span>Start Shopping</span>
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>
            ) : (
                <div className="orders-list">
                    {orders.map((order, index) => (
                        <div key={order.id} className="order-card stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="order-header">
                                <div>
                                    <p className="order-label">Order ID</p>
                                    <p className="order-value">#{order.id}</p>
                                </div>
                                <div>
                                    <p className="order-label">Date</p>
                                    <p className="order-value">{order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="order-label">Total</p>
                                    <p className="order-value">Rs.{order.totalAmount}</p>
                                </div>
                                <div className="order-status">
                                    <span className="status-badge">{order.status}</span>
                                </div>
                            </div>
                            <div className="order-items">
                                {(order.items || []).map((item, idx) => (
                                    <div key={idx} className="order-item-mini">
                                        <div className="mini-details">
                                            <p className="mini-name">{item.productName}</p>
                                            <p className="mini-qty">Qty: {item.quantity} | Price: Rs.{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
