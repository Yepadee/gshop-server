import { CategoryProvider } from "./provider";

export default {

    Mutation: {
        createCategory: (_, { productTypeId, name }, { injector }) =>
            injector.get(CategoryProvider).createCategory(productTypeId, name),
        createSubCategory: (_, { parentId, name }, { injector }) =>
            injector.get(CategoryProvider).createSubCategory(parentId, name)
    },
    
    ProductType: {
        categories: (productType, _, { injector }) =>
            injector.get(CategoryProvider).getSubCategories(productType.rootCategoryId),
        leafCategories: (productType, _, { injector }) =>
            injector.get(CategoryProvider).getLeafCategories(productType.rootCategoryId),
    },

    Product: {
        categories: product => product.categories
    }
};