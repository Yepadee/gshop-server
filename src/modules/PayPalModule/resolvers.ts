import { PayPalProvider } from "./provider";

export default {
  Mutation: {
    createPayPalOrder: (_, { items, returnUrl, cancelUrl }, { injector }) => injector.get(PayPalProvider).createOrder(items, returnUrl, cancelUrl),
    capturePayPalOrder: (_, { orderId }, { injector }) => injector.get(PayPalProvider).captureOrder(orderId),
  }
};