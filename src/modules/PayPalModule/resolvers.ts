import { PayPalProvider } from "./provider";

export default {
  Mutation: {
    createPayPalOrder: (_, { returnUrl, cancelUrl, shippingAddress, items }, { injector }) =>
      injector.get(PayPalProvider).createOrder(returnUrl, cancelUrl, shippingAddress, items),
    capturePayPalOrder: (_, { orderRef }, { injector }) =>
      injector.get(PayPalProvider).captureOrder(orderRef),
  }
};