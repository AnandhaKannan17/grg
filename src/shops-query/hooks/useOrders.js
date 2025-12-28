import { useQuery } from '@apollo/client';
import { GET_ORDER_HISTORY } from '../graphql/orderQueries';
import { useShop } from './useShop';

export const useOrders = (userId) => {
    const { shopId } = useShop();

    const { loading, error, data, refetch } = useQuery(GET_ORDER_HISTORY, {
        variables: {
            shopId: Number(shopId),
            userId: Number(userId)
        },
        skip: !shopId || !userId
    });

    return {
        orders: data?.orders || [],
        loading,
        error,
        refetch
    };
};
