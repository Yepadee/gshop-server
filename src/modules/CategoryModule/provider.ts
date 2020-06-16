import { Injectable } from "@graphql-modules/di";

import { CategoryRepository } from "@repository/CategoryRepository";
import { getCustomRepository } from "typeorm";

@Injectable()
export class CategoryProvider {
    repository = getCustomRepository(CategoryRepository);

    async addCategory(productTypeId: string, name: string) {
        await this.repository.insertRootCategory(productTypeId, name);
        return true;
    }

    async addSubCategory(parentId: string, name: string) {
        await this.repository.insertCategory(parentId, name);
        return true;
    }

    getCategories(args) {
        return this.repository.find({ where: args });
    }
}