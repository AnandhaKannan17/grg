import { useQuery } from '@apollo/client';
import { GET_MASTER_CATEGORIES } from '../graphql/categoryQueries';
import { useShop } from './useShop';

export const useCategories = () => {
    const { shopId } = useShop();

    const { loading, error, data } = useQuery(GET_MASTER_CATEGORIES, {
        variables: {
            filter: {
                shopId: Number(shopId)
            }
        },
        skip: !shopId
    });

    return {
        categories: data?.masterCategories || [],
        loading,
        error
    };
};
