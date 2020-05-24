import { ProductProvider } from "./provider";

export default {
  Query: {
    products: (_, args, { injector }) => injector.get(ProductProvider).getProducts(args),
    product: (_, { id }, { injector }) => injector.get(ProductProvider).getProductById(id)
  },

  Mutation: {
    addProduct: (_, { newProduct }, { injector }) => injector.get(ProductProvider).addProduct(newProduct),
    updateProduct: (_, { updatedProduct }, { injector }) => injector.get(ProductProvider).updateProduct(updatedProduct),
    removeProduct: (_, { id }, { injector }) => injector.get(ProductProvider).removeProduct(id)
  },

  Product: {
    id: product => product.id,
    name: product => product.name,
    description: product => product.description,
    catagory: product => product.catagory,
    price: product => product.price,
    images: (product, _, { injector }) => injector.get(ProductProvider).getProductImages(product.id)
  },

  ProductType: {
    products: productType => productType.products
  },

  Stock: {
    product: stock => stock.product
  }

};