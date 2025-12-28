import { useQuery } from '@apollo/client';
import { PRODUCT_BY_SPECIFICATION, PRODUCTS_BY_CATEGORY, GET_PRODUCTS } from '../graphql/productQueries';
import { useShop } from '../context/ShopContext';

export const useProducts = ({ mainCategory, subCategory, search, filters } = {}) => {
    const { shopId } = useShop();

    // Determine which query to use based on provided props
    let query = PRODUCT_BY_SPECIFICATION;
    let variables = {
        filter: {
            shopId: Number(shopId),
            searchKey: search || "",
            specifications: [],
        }
    };

    if (mainCategory || subCategory) {
        // If IDs are provided (like in Home.jsx), use GET_PRODUCTS
        if (typeof mainCategory === 'number' || (Array.isArray(mainCategory) && typeof mainCategory[0] === 'number')) {
            query = GET_PRODUCTS;
            variables = {
                filter: {
                    shopId: Number(shopId),
                    masterCategoryId: Array.isArray(mainCategory) ? mainCategory[0] : mainCategory,
                    categoryId: Array.isArray(subCategory) ? subCategory[0] : subCategory,
                }
            };
        } else {
            // If names are provided, use PRODUCTS_BY_CATEGORY
            query = PRODUCTS_BY_CATEGORY;
            variables = {
                filter: {
                    shopId: Number(shopId),
                    master: mainCategory || "",
                    secondary: subCategory || "",
                }
            };
        }
    } else if (filters) {
        variables.filter = {
            ...variables.filter,
            ...filters
        };
    }

    const { data, loading, error, refetch } = useQuery(query, {
        variables,
        skip: !shopId,
    });

    const products = data?.productBySpecification || data?.productsByCategory || data?.products || [];

    return {
        products,
        loading,
        error,
        refetch,
    };
};

export const useProductBySpecification = (filters) => {
    const { shopId } = useShop();
    const { data, loading, error, refetch } = useQuery(PRODUCT_BY_SPECIFICATION, {
        variables: {
            filter: {
                shopId: Number(shopId),
                specifications: [],
                ...filters,
            },
        },
        skip: !shopId,
    });

    return {
        products: data?.productBySpecification || [],
        loading,
        error,
        refetch,
    };
};
