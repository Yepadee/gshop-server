import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { ProductPropertyValue } from '@entity/ProductProperty/ProductPropertyValue';

@Injectable()
export class ProductPropertyProvider {
    repository = getRepository(ProductPropertyValue);

    async getProductPropertiesByProductId(productId) {
        const productPropertyValues = await this.repository.find({where: {productId}});
        const result = productPropertyValues.reduce(function (r, a) {
            r[a.make] = r[a.make] || [];
            r[a.make].push(a);
            return r;
        }, Object.create(null));

        return result;
    }
    
}