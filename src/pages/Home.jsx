import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import FloatingCart from '../components/FloatingCart';
import AnimatedBackground from '../components/AnimatedBackground';
import { ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts, useCategories, useShop } from '../shops-query';

import '../styles/Home.css';

const MAX_VISIBLE_PRODUCTS = 10;

const CategorySection = ({ title, categoryId, index, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [showAll, setShowAll] = useState(false);

    // Fetch products for this specific category
    const { products, loading, error } = useProducts({ mainCategory: [Number(categoryId)] });

    const hasMoreProducts = products.length > MAX_VISIBLE_PRODUCTS;
    const visibleProducts = showAll ? products : products.slice(0, MAX_VISIBLE_PRODUCTS);

    if (loading && !products.length) {
        return (
            <div className="category-section loading">
                <div className="category-bar">
                    <span className="category-title">{title}</span>
                    <Loader2 className="animate-spin" size={20} />
                </div>
            </div>
        );
    }

    if (!loading && products.length === 0) return null;

    return (
        <motion.div
            className="category-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
            <button className="category-bar" onClick={() => setIsOpen(!isOpen)}>
                <span className="category-title">{title}</span>
                <div className="category-right">
                    <span className="category-count">{products.length} {products.length === 1 ? 'item' : 'items'}</span>
                    <ChevronRight
                        size={20}
                        className={`category-chevron ${isOpen ? 'open' : ''}`}
                    />
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                            transition: {
                                height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.3, delay: 0.1 }
                            }
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.2 }
                            }
                        }}
                        className="category-products"
                    >
                        {visibleProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: idx * 0.05, duration: 0.3 }
                                }}
                                exit={{ opacity: 0, x: -10 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}

                        {/* View All Button */}
                        {hasMoreProducts && !showAll && (
                            <motion.button
                                className="view-all-btn"
                                onClick={() => setShowAll(true)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <span>View All Products ({products.length - MAX_VISIBLE_PRODUCTS} more)</span>
                                <ChevronDown size={18} />
                            </motion.button>
                        )}

                        {/* Show Less Button */}
                        {hasMoreProducts && showAll && (
                            <motion.button
                                className="view-all-btn"
                                onClick={() => setShowAll(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <span>Show Less</span>
                                <ChevronDown size={18} style={{ transform: 'rotate(180deg)' }} />
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Home = () => {
    const { loading: shopLoading, shopId } = useShop();
    const { categories, loading: catsLoading } = useCategories();

    if (shopLoading) {
        return (
            <div className="home-page flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="home-page">
            <AnimatedBackground variant="home" />
            <div className="container" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {catsLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="animate-spin" size={32} />
                    </div>
                ) : (
                    categories.map((cat, index) => (
                        <CategorySection
                            key={cat.id}
                            categoryId={cat.id}
                            title={cat.category}
                            index={index}
                            defaultOpen={index === 0}
                        />
                    ))
                )}
            </div>
            <FloatingCart />
        </div>
    );
};

export default Home;
