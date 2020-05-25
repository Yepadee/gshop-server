import { PayPalProvider } from "./provider";

export default {
    Mutation: {
      createPayPalOrder: (_, { stockIds }, { injector }) => injector.get(PayPalProvider).createOrder(stockIds),
      capturePayPalOrder: (_, { orderId }, { injector }) => injector.get(PayPalProvider).captureOrder(orderId)
    }
};