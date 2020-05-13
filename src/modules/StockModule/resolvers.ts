import { StockProvider } from "./provider";

export default {
    Query: {
      stock: (_, { productId, propertyValueIds }, { injector }) => injector.get(StockProvider).getStock(productId, propertyValueIds)
    },

    Stock: {
      id: stock => stock.id,
    },

    Product: {
      stock: product => product.stock
    }
  
};