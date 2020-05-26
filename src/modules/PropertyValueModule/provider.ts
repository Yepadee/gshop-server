import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";
import { PropertyValueRepository } from "@repository/PropertyValueRepository";

@Injectable()
export class PropertyValueProvider {
    repository = getCustomRepository(PropertyValueRepository);

    async addPropertyValue(propertyNameId, value)
    {
        await this.repository.insertPropertyValue(propertyNameId, value);
        return true;
    }

    async removePropertyValue(propertyValueId)
    {   
        await this.repository.deletePropertyValue(propertyValueId);
        return true;
    }
}