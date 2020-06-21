import { StockProvider } from "./provider";

export default {
    Query: {
      stockQuantity: (_, { productId, propertyValueIds }, { injector }) => injector.get(StockProvider).getStockQuantity(productId, propertyValueIds),
    },

    Mutation: {
      createStock: (_, args, { injector }) => injector.get(StockProvider).createStock(args),
      updateStockQuantity: (_, { stockId, quantity }, { injector }) => injector.get(StockProvider).updateStockQuantity(stockId, quantity),
      deleteStock: (_, { id }, { injector }) => injector.get(StockProvider).deleteStock(id)
    },

    Stock: {
      id: stock => stock.id,
      inStock: stock => stock.quantity > 0
    },

    Product: {
      allStock: product => product.stock,
      availableStock: (product, _, { injector }) => injector.get(StockProvider).getAvailableStock(product.id)
    },

    OrderItem: {
      stock: orderItem => orderItem.stock
    },

    PropertyValue: {
      stock: propertyValue => propertyValue.stock
    }
  
};