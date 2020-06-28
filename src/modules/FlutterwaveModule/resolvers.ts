import { FlutterwaveProvider } from "./provider";

export default {
  Mutation: {
    createFlutterwaveOrder: (_, { returnUrl, items, customerDetails }, { injector }) =>
      injector.get(FlutterwaveProvider).createOrder(returnUrl, items, customerDetails),
    captureFlutterwaveOrder: (_, { orderId }, { injector }) =>
      injector.get(FlutterwaveProvider).captureOrder(orderId),
  }
};