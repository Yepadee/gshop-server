import { PayPalProvider } from "./provider";

export default {
  Mutation: {
    createPayPalOrder: (_, { returnUrl, cancelUrl, shippingAddress, items }, { currency, injector }) =>
      injector.get(PayPalProvider).createOrder(returnUrl, cancelUrl, shippingAddress, currency, items),
    capturePayPalOrder: (_, { orderId }, { injector }) =>
      injector.get(PayPalProvider).captureOrder(orderId),
  }
};