import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { PropertyValue } from '@entity/Property/PropertyValue';

@Injectable()
export class AvailablePropertiesProvider {
    repository = getRepository(PropertyValue);

    async getAvailableProperties(productId) {
        const data = await this.repository.createQueryBuilder("propertyValue")
        .innerJoin("propertyValue.stock", "stock")
        .innerJoin("stock.product","product")
        .innerJoinAndSelect("propertyValue.propertyName", "propertyName")
        .where("product.id = :productId", {productId})
        .getMany();

        

        console.log(data);
        return data;
    }
}