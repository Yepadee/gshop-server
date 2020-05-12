import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { ProductType } from '@entity/ProductType';

@Injectable()
export class ProductTypeProvider {
    repository = getRepository(ProductType);
    async getProductTypes(args) {
        const productTypes = await this.repository.find({ where: args });
        return productTypes;
    }
    getProductTypeById(id: number) {
        return this.repository.findOne(id);
    }
}