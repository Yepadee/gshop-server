import { FlutterwaveProvider } from "./provider";

export default {
  Mutation: {
    createFlutterwaveOrder: (_, { returnUrl, customerDetails, items }, { currency, injector }) =>
      injector.get(FlutterwaveProvider).createOrder(returnUrl, customerDetails, items, currency),
    verifyFlutterwaveOrder: (_, { transactionRef, transactionId }, { injector }) =>
      injector.get(FlutterwaveProvider).verifyOrder(transactionRef, transactionId),
  }
};