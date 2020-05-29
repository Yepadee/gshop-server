import { OrderProvider } from "./provider";

export default {
    Query: {
      orders: (_, args, { injector }) => injector.get(OrderProvider).getOrders(args),
      order: (_, { id }, { injector }) => injector.get(OrderProvider).getOrderById(id)
    },

    Mutation: {
      updateOrderStatus:  (_, { id, newStatus }, { injector }) => injector.get(OrderProvider).updateOrderStatus(id, newStatus),
    },

    OrderItem: {
      order: orderItems => orderItems.order
    },

    Customer: {
      orders: customer => customer.orders
    }
};