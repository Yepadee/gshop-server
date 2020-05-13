import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { PropertyName } from '@entity/Property/PropertyName';

@Injectable()
export class PropertyNameProvider {
    repository = getRepository(PropertyName);

    getTypePropertiesByTypeId(typeId) {
        return this.repository.find({ where: { typeId } });
    }
}