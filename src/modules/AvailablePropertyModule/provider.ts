import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { PropertyValue } from '@entity/Property/PropertyValue';

import { groupBy } from 'lodash';
//import { PropertyName } from "@entity/Property/PropertyName";

@Injectable()
export class AvailablePropertyProvider {
    repository = getRepository(PropertyValue);

    async getAvailableProperties(productId) {
        const propertyValues: any = await this.repository.createQueryBuilder("propertyValue")
        .innerJoinAndSelect("propertyValue.propertyName", "propertyName")
        .innerJoin("propertyValue.stock", "stock")
        .innerJoin("stock.product","product")
        .where("product.id = :productId", {productId})
        .getMany();

        const grouped = groupBy(propertyValues, propertyValue => propertyValue.__propertyName__.name);
        return Object.keys(grouped).map((propertyName) => {
            const availableProperty = {
                name: propertyName,
                values: grouped[propertyName]
            };
            return availableProperty;
        });
    }
}