import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { TypePropertyName } from '@entity/TypeProperty/TypePropertyName';

@Injectable()
export class TypePropertyNameProvider {
    repository = getRepository(TypePropertyName);

    getTypePropertiesByTypeId(typeId) {
        return this.repository.find({ where: { typeId } });
    }
}