import { CategoryProvider } from "./provider";

export default {
    Query: {
        categories:  (_, args, { injector }) =>
        injector.get(CategoryProvider).getCategories(args),
    },
    
    Mutation: {
        addCategory: (_, { productTypeId, name }, { injector }) =>
            injector.get(CategoryProvider).addCategory(productTypeId, name),
        addSubCategory: (_, { parentId, name }, { injector }) =>
            injector.get(CategoryProvider).addSubCategory(parentId, name)
    },
    
    ProductType: {
        categories: async productType => (await productType.rootCategory).children
    },
};