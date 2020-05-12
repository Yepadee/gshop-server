import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { ProductPropertyValue } from '@entity/ProductProperty/ProductPropertyValue';

@Injectable()
export class ProductPropertyProvider {
    repository = getRepository(ProductPropertyValue);

    async getProductPropertiesByProductId(productId) {
        const productPropertyValues = await this.repository.find({
        where: {
            productId: productId
        },
        relations: ["propertyName"]
        });

        const productProperty = {
            
        }

        return productPropertyValues;
    }
    
}