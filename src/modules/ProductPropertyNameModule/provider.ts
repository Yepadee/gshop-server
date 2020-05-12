import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { ProductPropertyName } from '@entity/ProductProperty/ProductPropertyName';

@Injectable()
export class ProductPropertyNameProvider {
    repository = getRepository(ProductPropertyName);
}