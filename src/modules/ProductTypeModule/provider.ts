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

    async createProductType(name, propertyNameIds)
    {
        return await this.repository.insertProductType(name, propertyNameIds);
    }

    async deleteProductType(productTypeId)
    {
        return await this.repository.deleteProductType(productTypeId);
    }

    async addPropertyNames(id: number, propertyNameIds: number[]) {
        return await this.repository.addPropertyNames(id, propertyNameIds);
    }

    async removePropertyNames(id: number, propertyNameIds: number[]) {
        return await this.repository.removePropertyNames(id, propertyNameIds);
    }
}