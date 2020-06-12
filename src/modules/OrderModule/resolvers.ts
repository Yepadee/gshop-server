import { OrderProvider } from "./provider";

export default {
  Query: {
    orders: (_, args, { injector }) => injector.get(OrderProvider).getOrders(args),
    order: (_, { id }, { injector }) => injector.get(OrderProvider).getOrderById(id)
  },

  Mutation: {
    setOrderStatus: (_, { id, status }, { injector }) =>
      injector.get(OrderProvider).setOrderStatus(id, status),
    setSupplierOrderId: (_, { id, orderId }, { injector }) =>
      injector.get(OrderProvider).setSupplierOrderId(id, orderId)
  },

  OrderItem: {
    order: orderItems => orderItems.order
  },

  Customer: {
    orders: customer => customer.orders
  }
};