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

    async addProduct(product) {
        const newProduct = new Product();
        
        newProduct.typeId = product.typeId;
        newProduct.name = product.name;
        newProduct.description = product.description;
        newProduct.price = product.price;
        newProduct.catagory = product.catagory;
        
        console.log(newProduct);
        this.repository.save(newProduct);
        return true;
    }

    async deleteProductById(id: number) {
        try {
            await this.repository.delete(id);
            return true;
        }
        catch {
            return false;
        }
    }
}