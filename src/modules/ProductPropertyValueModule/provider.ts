import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { ProductPropertyValue } from '@entity/ProductProperty/ProductPropertyValue';

@Injectable()
export class ProductPropertyValueProvider {
    repository = getRepository(ProductPropertyValue);
}