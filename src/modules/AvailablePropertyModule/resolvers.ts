import { AvailablePropertyProvider } from "./provider";

export default {
    Product: {
      availableProperties: (product, _, { injector }) => injector.get(AvailablePropertyProvider).getAvailableProperties(product.id),
    }
  
};