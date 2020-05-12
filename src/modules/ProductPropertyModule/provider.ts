import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { ProductPropertyValue } from '@entity/ProductProperty/ProductPropertyValue';

import { groupBy } from "lodash";

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

        const grouped = groupBy(productPropertyValues, propertyValue => propertyValue.propertyName.name);
        return Object.keys(grouped).map((propertyName) => {
            const productProperty = {
                name: propertyName,
                values: grouped[propertyName]
            };
            return productProperty;
        });
    }
    
}