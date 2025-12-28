import { gql } from '@apollo/client';

export const ORDER_BY_CART = gql`
  mutation OrderByCart(
    $userId: Int
    $shopId: Int
    $voucherNo: String
    $orderType: String
    $customerId: Int
    $customerName: String
    $customerMobile: String
    $customerAddress: String
    $pickuptime: DateTime
    $feedback: String
    $shopPhone: String
    $rating: Int
    $couponId: Int
    $creditPoints: Float
    $paymentInfo: String
    $billingAddress: Int
    $shippingAddress: Int
  ) {
    OrderbyCart(
      userId: $userId
      shopId: $shopId
      voucherNo: $voucherNo
      orderType: $orderType
      customerId: $customerId
      customerName: $customerName
      customerMobile: $customerMobile
      customerAddress: $customerAddress
      pickuptime: $pickuptime
      feedback: $feedback
      shopPhone: $shopPhone
      rating: $rating
      couponId: $couponId
      creditPoints: $creditPoints
      paymentInfo: $paymentInfo
      billingAddress: $billingAddress
      shippingAddress: $shippingAddress
    ) {
      id
      customerName
    }
  }
`;
