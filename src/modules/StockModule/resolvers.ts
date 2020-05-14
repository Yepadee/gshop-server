import { StockProvider } from "./provider";

export default {
    Query: {
      stockQuantity: (_, { productId, propertyValueIds }, { injector }) => injector.get(StockProvider).getStockQuantity(productId, propertyValueIds)
    },

    Mutation: {
      addStock: (_, args, { injector }) => injector.get(StockProvider).addStock(args)
    },

    Stock: {
      id: stock => stock.id,
    },

    Product: {
      stock: product => product.stock
    }
  
};