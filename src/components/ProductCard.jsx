import React, { useContext, useState } from 'react';
import { Heart, Plus, Minus } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity, removeFromCart, toggleWishlist, isInWishlist } = useContext(ShopContext);
  const wishlisted = isInWishlist(product.id);
  const [imageError, setImageError] = useState(false);

  const productName = product.name;
  const productPrice = product.prize;

  // Normalize image URL - handle relative paths from API
  const getImageUrl = (url) => {
    if (!url) return null;
    // If already absolute URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Prepend the CDN base URL for relative paths
    return `https://api.shop.strackit.com${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const featureImage = getImageUrl(product.featureImage);

  // Debug: Log the image URL for troubleshooting
  if (product.featureImage) {
    console.log(`Product: ${product.name}, Original: ${product.featureImage}, Resolved: ${featureImage}`);
  }

  // Check if product is in cart and get quantity
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Use the specific background colors from the shared images
  const bgColors = ['#fde68a', '#94a3b8', '#cbd5e1', '#fecaca', '#d1fae5'];
  const bgColor = bgColors[product.id % bgColors.length];

  // Check if image should be displayed
  const hasValidImage = featureImage && !imageError;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.002 }}
      className="product-card"
    >
      {/* Always show the colored placeholder box */}
      <div className="product-image-container" style={{ backgroundColor: bgColor }}>
        {featureImage && !imageError && (
          <img src={featureImage} alt={productName} onError={handleImageError} />
        )}
      </div>

      <div className="product-info-center">
        <h3 className="product-name">{productName}</h3>
        <p className="product-price">Rs.{productPrice}</p>
      </div>

      <div className="product-actions-right">
        <button
          className={`heart-btn ${wishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
        >
          <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
        </button>

        <AnimatePresence mode="wait">
          {quantity > 0 ? (
            <motion.div
              key="quantity"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="quantity-control"
            >
              <button
                className="qty-btn"
                onClick={handleDecrement}
              >
                <Minus size={14} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id, quantity + 1);
                }}
              >
                <Plus size={14} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="add"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="add-btn"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              ADD TO CART
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProductCard;
