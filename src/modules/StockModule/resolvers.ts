import { StockProvider } from "./provider";

export default {
    Query: {
      stockQuantity: (_, { productId, propertyValueIds }, { injector }) => injector.get(StockProvider).getStockQuantity(productId, propertyValueIds),
      itemInStock: (_, { productId, propertyValueIds }, { injector }) => injector.get(StockProvider).getStockQuantity(productId, propertyValueIds) > 0
    },

    Mutation: {
      addStock: (_, args, { injector }) => injector.get(StockProvider).addStock(args),
      updateStockQuantity: (_, { stockId, quantity }, { injector }) => injector.get(StockProvider).updateStockQuantity(stockId, quantity),
      deleteStock: (_, { stockId }, { injector }) => injector.get(StockProvider).deleteStock(stockId)
    },

    Stock: {
      id: stock => stock.id,
    },

    Product: {
      stock: product => product.stock
    }
  
};