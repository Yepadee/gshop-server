import { PayPalProvider } from "./provider";

export default {
  Query: {
    getPayPalOrder: (_, { orderId }, { injector }) => injector.get(PayPalProvider).getOrder(orderId),
    getPayPalOrderItemsDetails: (_, { orderId }, { injector }) => injector.get(PayPalProvider).getOrderItemsDetails(orderId)
  },
  Mutation: {
    createPayPalOrder: (_, { items, returnUrl, cancelUrl }, { injector }) => injector.get(PayPalProvider).createOrder(items, returnUrl, cancelUrl),
    capturePayPalOrder: (_, { orderId }, { injector }) => injector.get(PayPalProvider).captureOrder(orderId),
  }
};