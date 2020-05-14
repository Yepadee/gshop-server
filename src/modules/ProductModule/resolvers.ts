import { ProductProvider } from "./provider";

export default {
  Query: {
    products: (_, args, { injector }) => injector.get(ProductProvider).getProducts(args),
    product: (_, { id }, { injector }) => injector.get(ProductProvider).getProductById(id)
  },

  Mutation: {
    addProduct: (_, { newProduct }, { injector }) => injector.get(ProductProvider).addProduct(newProduct),
    deleteProduct: (_, { id }, { injector }) => injector.get(ProductProvider).deleteProductById(id)
  },

  Product: {
    id: product => product.id,
    name: product => product.name,
    description: product => product.description,
    catagory: product => product.catagory,
    price: product => product.price,
  },

  ProductType: {
    products: productType => productType.products
  },

  Stock: {
    product: stock => stock.product
  }

};