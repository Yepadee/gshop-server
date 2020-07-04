import { Injectable } from "@graphql-modules/di";

import { CategoryRepository } from "@repository/CategoryRepository";
import { getCustomRepository } from "typeorm";

@Injectable()
export class CategoryProvider {
    repository = getCustomRepository(CategoryRepository);

    createCategory(productTypeId: number, name: string) {
        return this.repository.insertCategory(productTypeId, name);
    }

    createSubCategory(parentId: number, name: string) {
        return this.repository.insertSubCategory(parentId, name);
    }

    updateCategory(args) {
        return this.repository.updateCategory(args);
    }


    deleteCategory(id: number) {
        return this.repository.deleteCategory(id);
    }

    getLeafCategories(parentId: number) {
        return this.repository.getLeafCategories(parentId);
    }

    getCategories(args) {
        return this.repository.find({ where: args });
    }

    

    getSubCategories(parentId: number) {
        return this.repository.getSubCategories(parentId);
    }

    addProduct(id: number, productId: number) {
        return this.repository.addProduct(id, productId);
    }

    removeProduct(id: number, productId: number) {
        return this.repository.removeProduct(id, productId);
    }
}