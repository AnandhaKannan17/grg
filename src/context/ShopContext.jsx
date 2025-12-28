import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useShop } from '../shops-query/hooks/useShop';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const { shopId } = useShop();

    // Define scoped keys
    const cartKey = useMemo(() => `cart_${shopId || 'default'}`, [shopId]);
    const wishlistKey = useMemo(() => `wishlist_${shopId || 'default'}`, [shopId]);
    const ordersKey = useMemo(() => `orders_${shopId || 'default'}`, [shopId]);

    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);

    // Load data when shopId/keys change
    useEffect(() => {
        const savedCart = localStorage.getItem(cartKey);
        setCart(savedCart ? JSON.parse(savedCart) : []);

        const savedWishlist = localStorage.getItem(wishlistKey);
        setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);

        const savedOrders = localStorage.getItem(ordersKey);
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    }, [cartKey, wishlistKey, ordersKey]);

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
        if (shopId) localStorage.setItem(ordersKey, JSON.stringify(orders));
    }, [orders, ordersKey, shopId]);

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
            return [...prevCart, { ...product, quantity: 1 }];
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
                return prevWishlist.filter((item) => item.id !== product.id);
            }
            return [...prevWishlist, product];
        });
    };

    const placeOrder = () => {
        if (cart.length === 0) return;
        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            items: [...cart],
            total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
            status: 'Processing'
        };
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
        setCart([]);
    };

    const value = {
        cart,
        wishlist,
        orders,
        isDarkMode,
        toggleTheme,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        placeOrder,
        isInWishlist: (productId) => wishlist.some((item) => item.id === productId),
    };

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
