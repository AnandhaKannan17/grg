import { useMutation } from '@apollo/client';
import { ORDER_BY_CART } from '../graphql/orderMutations';
import { useShop } from './useShop';

export const usePlaceOrder = () => {
    const { shopId } = useShop();
    const [mutate, result] = useMutation(ORDER_BY_CART);

    const placeOrder = async ({ userId, cartItems, paymentDetails }) => {
        if (!shopId) throw new Error("Shop ID not available");

        return mutate({
            variables: {
                shopId: Number(shopId),
                userId: Number(userId),
                cartItems,
                paymentDetails
            }
        });
    };

    return {
        placeOrder,
        ...result
    };
};
