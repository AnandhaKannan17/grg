import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useShop } from '../shops-query/hooks/useShop';
import { getUserData, logoutUser as logoutService } from '../shops-query/modules/auth';
import { useToast } from './ToastContext';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const { shopId } = useShop();
    const { showToast } = useToast();

    // Define scoped keys
    const cartKey = useMemo(() => `cart_${shopId || 'default'}`, [shopId]);
    const wishlistKey = useMemo(() => `wishlist_${shopId || 'default'}`, [shopId]);

    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState(() => getUserData());

    useEffect(() => {
        const savedCart = localStorage.getItem(cartKey);
        setCart(savedCart ? JSON.parse(savedCart) : []);

        const savedWishlist = localStorage.getItem(wishlistKey);
        setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    }, [cartKey, wishlistKey]);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        if (shopId) localStorage.setItem(cartKey, JSON.stringify(cart));
    }, [cart, cartKey, shopId]);

    useEffect(() => {
        if (shopId) localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    }, [wishlist, wishlistKey, shopId]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === product.id);
            if (existingProduct) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Normalize product data for cart
            const normalizedProduct = {
                ...product,
                price: Number(product.price || product.prize || 0),
                image: product.image || product.featureImage || '',
                quantity: 1
            };
            showToast('Product added to cart!', 'success');
            return [...prevCart, normalizedProduct];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const toggleWishlist = (product) => {
        setWishlist((prevWishlist) => {
            const isWishlisted = prevWishlist.find((item) => item.id === product.id);
            if (isWishlisted) {
                showToast('Removed from wishlist', 'info');
                return prevWishlist.filter((item) => item.id !== product.id);
            }
            showToast('Added to wishlist!', 'success');
            return [...prevWishlist, product];
        });
    };

    const placeOrder = () => {
        if (cart.length === 0) return;
        // Logic will be handled by usePlaceOrder hook in checkout, 
        // removing local storage order logic as requested
        setCart([]);
        showToast('Order placed successfully!', 'success');
    };

    const value = {
        cart,
        wishlist,
        isDarkMode,
        toggleTheme,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        placeOrder,
        user,
        logout: () => {
            showToast('Logged out successfully', 'info');
            logoutService();
            setUser(null);
        },
        isInWishlist: (productId) => wishlist.some((item) => item.id === productId),
    };

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
