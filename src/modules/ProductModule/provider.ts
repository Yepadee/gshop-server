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
        
        await this.repository.save(newProduct);
        return true;
    }

    async updateProduct(updatedProduct) {
        const values = {};

        if (updatedProduct.name) Object.assign(values, {name: updatedProduct.name})
        if (updatedProduct.catagory) Object.assign(values, {catagory: updatedProduct.catagory})
        if (updatedProduct.description) Object.assign(values, {description: updatedProduct.description})
        if (updatedProduct.price) Object.assign(values, {price: updatedProduct.price})

        await this.repository.createQueryBuilder()
        .update(Product)
        .set(values)
        .where("id = :productId", { productId: updatedProduct.id })
        .execute();
        
        return true;
    }

    async deleteProduct(id: number) {
        try {
            await this.repository.delete(id);
            return true;
        }
        catch {
            return false;
        }
    }
}