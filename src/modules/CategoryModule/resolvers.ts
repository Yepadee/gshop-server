import { CategoryProvider } from "./provider";

export default {
    Query: {
        categories:  (_, args, { injector }) =>
        injector.get(CategoryProvider).getCategories(args),
    },
    
    Mutation: {
        createCategory: (_, { productTypeId, name }, { injector }) =>
            injector.get(CategoryProvider).createCategory(productTypeId, name),
        createSubCategory: (_, { parentId, name }, { injector }) =>
            injector.get(CategoryProvider).createSubCategory(parentId, name)
    },
    
    ProductType: {
        categories: async productType => (await productType.rootCategory).children
    },
};