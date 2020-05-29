import { OrderItemProvider } from "./provider";

export default {
    Query: {
        getItemsByPayPalOrderId: (_, { orderId }, { injector }) => injector.get(OrderItemProvider).getItemsByPayPalOrderId(orderId)
    },
    
    Order: {
        items: order => order.items
    },

    Stock: {
        orders: stock => stock.orders
    }
};