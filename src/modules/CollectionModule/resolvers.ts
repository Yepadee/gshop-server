import { CollectionProvider } from "./provider";

export default {
  Query: {
    collections: (_, args, { injector }) =>
      injector.get(CollectionProvider).getCollections(args),
    collection: (_, { id }, { injector }) =>
      injector.get(CollectionProvider).getCollection(id)
  },

  Mutation: {
    createCollection: (_, { name }, { injector }) =>
      injector.get(CollectionProvider).createCollection(name),
    updateCollection: (_, args, { injector }) =>
      injector.get(CollectionProvider).updateCollection(args),
    deleteCollection: (_, { id }, { injector }) =>
      injector.get(CollectionProvider).deleteCollection(id),

    addProductToCollection: (_, { id, productId }, { injector }) =>
      injector.get(CollectionProvider).addProductToCollection(id, productId),
    removeProductFromCollection: (_, { id, productId }, { injector }) =>
      injector.get(CollectionProvider).removeProductFromCollection(id, productId)
  },

  Product: {
    collections: product => product.collections
  }

};