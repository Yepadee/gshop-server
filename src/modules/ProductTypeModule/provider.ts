import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";
import { ProductTypeRepository } from "@repository/ProductTypeRepository";

@Injectable()
export class ProductTypeProvider {
    repository = getCustomRepository(ProductTypeRepository);

    getProductTypes(args) {
        return this.repository.find({ where: args });
    }
    
    getProductTypeById(id: number) {
        return this.repository.findOne(id);
    }

    async addProductType(name, propertyNameIds)
    {
        await this.repository.insertProductType(name, propertyNameIds);
        return true;
    }

    async removeProductType(productTypeId)
    {
        await this.repository.delete(productTypeId);
        return true;
    }
}