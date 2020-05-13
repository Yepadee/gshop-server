import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { PropertyValue } from '@entity/Property/PropertyValue';

@Injectable()
export class PropertyValueProvider {
    repository = getRepository(PropertyValue);
}