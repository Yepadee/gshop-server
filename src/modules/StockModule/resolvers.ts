import { StockProvider } from "./stock.provider";

export default {
    Query: {
      stocks: (_, args, { injector }) => injector.get(StockProvider).getStock(args),
      stock: (_, { id }, { injector }) => injector.get(StockProvider).getStockById(id)
    },

    Stock: {
      id: stock => stock.id,
    }
  
};