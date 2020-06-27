import { FlutterwaveProvider } from "./provider";

export default {
  Mutation: {
    createFlutterwaveOrder: (_, { items, returnUrl, cancelUrl }, { injector }) =>
      injector.get(FlutterwaveProvider).createOrder(items, returnUrl, cancelUrl),
    captureFlutterwaveOrder: (_, { orderId }, { injector }) =>
      injector.get(FlutterwaveProvider).captureOrder(orderId),
  }
};