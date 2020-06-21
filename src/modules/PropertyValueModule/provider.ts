import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";
import { PropertyValueRepository } from "@repository/PropertyValueRepository";

@Injectable()
export class PropertyValueProvider {
    repository = getCustomRepository(PropertyValueRepository);

    async createPropertyValue(propertyNameId, value)
    {
        return await this.repository.insertPropertyValue(propertyNameId, value);
    }

    async deletePropertyValue(propertyValueId)
    {   
        return await this.repository.deletePropertyValue(propertyValueId);
    }
}