import { ProductProvider } from "./provider";

export default {
  Query: {
    products: (_, { take, skip, keyword }, { injector }) => injector.get(ProductProvider).getProducts(take, skip, keyword),
    allProducts: (_, args, { injector }) => injector.get(ProductProvider).getProducts(args),
    product: (_, { id }, { injector }) => injector.get(ProductProvider).getProductById(id)
  },

  Mutation: {
    createProduct: (_, { newProduct }, { injector }) =>
      injector.get(ProductProvider).createProduct(newProduct),
    updateProduct: (_, { updatedProduct }, { injector }) =>
      injector.get(ProductProvider).updateProduct(updatedProduct),
    deleteProduct: (_, { id }, { injector }) =>
      injector.get(ProductProvider).deleteProduct(id),

    publishProduct: (_, { id, published }, { injector }) =>
      injector.get(ProductProvider).setPublished(id, published),
  
    addProductRequiredProperties: (_, { id, propertyNameIds }, { injector }) =>
      injector.get(ProductProvider).addProductRequiredProperties(id, propertyNameIds),
    removeProductRequiredProperties: (_, { id, propertyNameIds }, { injector }) =>
      injector.get(ProductProvider).removeProductRequiredProperties(id, propertyNameIds),
  },

  Product: {
    id: product => product.id,
    name: product => product.name,
    description: product => product.description,
    catagory: product => product.catagory,
    price: product => product.price,
    images: (product, _, { injector }) => injector.get(ProductProvider).getProductImages(product.id),
    imageDir: product => "product-images/" + product.id
  },

  ProductType: {
    products: productType => productType.products
  },

  Stock: {
    product: stock => stock.product
  }

};