import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SHOP_DETAILS } from '../graphql/shopQueries';

export const ShopQueryContext = createContext();

export const ShopQueryProvider = ({ children }) => {
    // Determine domain: env var, or window origin (fallback)
    const [domain, setDomain] = useState(() => {
        return import.meta.env.VITE_CUSTOM_DOMAIN_NAME || window.location.origin;
    });

    const { loading, error, data } = useQuery(GET_SHOP_DETAILS, {
        variables: {
            filter: {
                customDomain: domain
            }
        },
        skip: !domain,
        fetchPolicy: 'cache-and-network'
    });

    const shopObject = Array.isArray(data?.shop) ? data.shop[0] : data?.shop;
    const shopId = shopObject?.id;

    const value = {
        shopId,
        shopDetails: shopObject,
        loading,
        error
    };

    const isInternalServerError = error && (error.message.includes("Cannot read properties of undefined") || error.networkError?.statusCode === 500);
    const isConfigError = error && error.message.includes("Unexpected token");

    if (loading && !data) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #e2e8f0',
                        borderTop: '3px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Initializing {domain.replace('https://', '')}...</p>
                </div>
            </div>
        );
    }

    return (
        <ShopQueryContext.Provider value={value}>
            {isConfigError && (
                <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', textAlign: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
                    <strong>API Configuration Error:</strong> The GraphQL endpoint for <code>{domain}</code> appears to be incorrect (received HTML instead of JSON).
                    <br />Please check <code>VITE_GRAPHQL_URI</code> in <code>.env</code> and the proxy target in <code>vite.config.js</code>.
                </div>
            )}
            {isInternalServerError && (
                <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', textAlign: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
                    <strong>Shop Not Found:</strong> The domain <code>{domain}</code> is not registered on the backend API.
                    <br />(Backend Error: {error.message})
                </div>
            )}
            {error && !isConfigError && !isInternalServerError && (
                <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', textAlign: 'center', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 }}>
                    <strong>API Connection Error:</strong> {error.message}
                </div>
            )}
            {children}
        </ShopQueryContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopQueryContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopQueryProvider');
    }
    return context;
};
