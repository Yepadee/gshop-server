import { FlutterwaveProvider } from "./provider";

export default {
  Mutation: {
    createFlutterwaveOrder: (_, { returnUrl, items, customerDetails }, { injector }) =>
      injector.get(FlutterwaveProvider).createOrder(returnUrl, items, customerDetails),
      verifyFlutterwaveOrder: (_, { transactionRef, transactionId }, { injector }) =>
      injector.get(FlutterwaveProvider).verifyOrder(transactionRef, transactionId),
  }
};