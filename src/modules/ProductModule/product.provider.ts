import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { Product } from '@entity/Product';

@Injectable()
export class ProductProvider {
    repository = getRepository(Product);
    async getProducts(args) {
        console.log(args);
        
        const users = await this.repository.find({ where: args });
        console.log(users);
        return users;
    }
    getProductById(id: number) {
        return this.repository.findOne(id);
    }
}