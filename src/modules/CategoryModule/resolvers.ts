import { CategoryProvider } from "./provider";

export default {

    Mutation: {
        createCategory: (_, { productTypeId, name }, { injector }) =>
            injector.get(CategoryProvider).createCategory(productTypeId, name),
        createSubCategory: (_, { parentId, name }, { injector }) =>
            injector.get(CategoryProvider).createSubCategory(parentId, name),

        updateCategory: (_, args, { injector }) =>
            injector.get(CategoryProvider).updateCategory(args),    

        deleteCategory: (_, { id }, { injector }) =>
            injector.get(CategoryProvider).deleteCategory(id),        

        addProductToCategory: (_, { id, productId }, { injector }) =>
            injector.get(CategoryProvider).addProduct(id, productId),

        removeProductFromCategory: (_, { id, productId }, { injector }) =>
            injector.get(CategoryProvider).removeProduct(id, productId)
    },
    
    ProductType: {
        categories: (productType, _, { injector }) =>
            injector.get(CategoryProvider).getSubCategories(productType.rootCategoryId),
        leafCategories: (productType, _, { injector }) =>
            injector.get(CategoryProvider).getLeafCategories(productType.rootCategoryId),
    },

    Product: {
        category: product => product.category
    }
};