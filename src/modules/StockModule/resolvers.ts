import { StockProvider } from "./provider";
import { PropertyValue } from "@entity/PropertyValue";

export default {
    Query: {
      stockQuantity: (_, { productId, propertyValueIds }, { injector }) => injector.get(StockProvider).getStockQuantity(productId, propertyValueIds),
      itemInStock: (_, { productId, propertyValueIds }, { injector }) => injector.get(StockProvider).itemInStock(productId, propertyValueIds)
    },

    Mutation: {
      addStock: (_, args, { injector }) => injector.get(StockProvider).addStock(args),
      updateStockQuantity: (_, { stockId, quantity }, { injector }) => injector.get(StockProvider).updateStockQuantity(stockId, quantity),
      removeStock: (_, { id }, { injector }) => injector.get(StockProvider).removeStock(id)
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