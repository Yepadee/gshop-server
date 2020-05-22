import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { PropertyValue } from '@entity/PropertyValue';

@Injectable()
export class PropertyValueProvider {
    repository = getRepository(PropertyValue);

    async addPropertyValue(propertyNameId, value)
    {
        const propertyValue = new PropertyValue();
        propertyValue.value = value;
        propertyValue.propertyNameId = propertyNameId;

        await this.repository.save(propertyValue);

        return true;
    }

    async removePropertyValue(propertyValueId)
    {   
        const data = await this.repository.createQueryBuilder("propertyValue")
        .select("COUNT(*) > 0", "hasStock")
        .innerJoin("propertyValue.stock", "stock")
        .getRawOne();

        if (data.hasStock == '1') throw new Error("Cannot remove value if there exists stock with this value.");

        await this.repository.delete(propertyValueId);
        return true;
    }
}