import { PayPalProvider } from "./provider";

export default {
    Mutation: {
      createPayPalOrder: (_, { items }, { injector }) => injector.get(PayPalProvider).createOrder(items),
      capturePayPalOrder: (_, { orderId }, { injector }) => injector.get(PayPalProvider).captureOrder(orderId)
    }
};