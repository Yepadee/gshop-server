import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { ProductType } from '@entity/ProductType';

@Injectable()
export class ProductTypeProvider {
    repository = getRepository(ProductType);

    getProductTypes(args) {
        return this.repository.find({ where: args });
    }
    
    getProductTypeById(id: number) {
        return this.repository.findOne(id);
    }

    async addProductType(name, propertyNameIds)
    {
        try
        {
            const productType = new ProductType();
            productType.name = name;
            productType.propertyNames = propertyNameIds.map(propertyNameId => <any>{id: propertyNameId});
            await this.repository.save(productType);
            return true;
        }
        catch
        {
            return false;
        }
    }

    async removeProductType(productTypeId)
    {
        await this.repository.delete(productTypeId);
        return true;
    }
}