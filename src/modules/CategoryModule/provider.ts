import { Injectable } from "@graphql-modules/di";

import { CategoryRepository } from "@repository/CategoryRepository";
import { getCustomRepository } from "typeorm";

@Injectable()
export class CategoryProvider {
    repository = getCustomRepository(CategoryRepository);

    async createCategory(productTypeId: string, name: string) {
        return await this.repository.insertRootCategory(productTypeId, name);
    }

    async createSubCategory(parentId: string, name: string) {
        return await this.repository.insertCategory(parentId, name);
    }

    getCategories(args) {
        return this.repository.find({ where: args });
    }
}