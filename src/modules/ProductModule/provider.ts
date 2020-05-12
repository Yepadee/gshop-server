import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { Product } from '@entity/Product';

@Injectable()
export class ProductProvider {
    repository = getRepository(Product);
    getProducts(args) {
        return this.repository.find({ where: args });
    }
    getProductById(id: number) {
        return this.repository.findOne(id);
    }
}