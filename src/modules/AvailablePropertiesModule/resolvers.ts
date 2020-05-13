import { AvailablePropertiesProvider } from "./provider";

export default {
    Product: {
      availableProperties: (product, _, { injector }) => injector.get(AvailablePropertiesProvider).getAvailableProperties(product.id),
    }
  
};