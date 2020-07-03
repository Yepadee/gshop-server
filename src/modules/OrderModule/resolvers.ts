import { OrderProvider } from "./provider";

export default {
  Query: {
    orders: (_, { paymentMethod, status, take, skip }, { injector }) =>
      injector.get(OrderProvider).getOrders(paymentMethod, status, take, skip),
    order: (_, { id }, { injector }) =>
      injector.get(OrderProvider).getOrderById(id)
  },

  Mutation: {
    setOrderStatus: (_, { id, status }, { injector }) =>
      injector.get(OrderProvider).setOrderStatus(id, status),
    setSupplierOrderId: (_, { id, orderId }, { injector }) =>
      injector.get(OrderProvider).setSupplierOrderId(id, orderId)
  },

  Order: {
    transactionPath: (order, _, { injector }) =>
      injector.get(OrderProvider).getTransactionPath(order)
  },

  OrderItem: {
    order: orderItems => orderItems.order
  },

  Customer: {
    orders: customer => customer.orders
  }
};