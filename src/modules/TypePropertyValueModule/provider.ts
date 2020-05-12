import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { TypePropertyValue } from '@entity/TypeProperty/TypePropertyValue';

@Injectable()
export class TypePropertyValueProvider {
    repository = getRepository(TypePropertyValue);
}