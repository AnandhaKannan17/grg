import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import '../styles/Wishlist.css';

const Wishlist = () => {
    const { wishlist } = useContext(ShopContext);

    return (
        <div className="wishlist-page slide-in-up container">
            {/* Animated Background */}
            <AnimatedBackground variant="wishlist" />

            <h1 className="page-title">My Wishlist</h1>

            {wishlist.length === 0 ? (
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
                                scale: [1, 1.15, 1],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <Heart size={48} className="empty-icon" />
                    </div>
                    <h2 className="empty-title">Your wishlist is empty</h2>
                    <p className="empty-subtitle">Save your favorite items here to buy them later.<br />Tap the heart icon on any product to add it!</p>
                    <Link to="/" className="empty-cta">
                        <span>Explore Products</span>
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>
            ) : (
                <div className="product-list">
                    {wishlist.map((product, index) => (
                        <div key={product.id} className="stagger-item" style={{ animationDelay: `${index * 0.08}s` }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
