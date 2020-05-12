import { ProductPropertyProvider } from "./provider";


export default {
  ProductProperty: {
    name: productProperty => productProperty.name
  },
  Product: {
    productProperties: (product, _, { injector }) => injector.get(ProductPropertyProvider).getProductPropertiesByProductId(product.id)
  }
  
};