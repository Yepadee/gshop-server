import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";

import * as fs from "fs";
import { ProductRepository } from "@repository/ProductRepository";

@Injectable()
export class ProductProvider {
    repository = getCustomRepository(ProductRepository);

    getProducts(args) {
        return this.repository.find({ where: args });
    }
    
    getProductById(id: number) {
        return this.repository.findOne(id);
    }

    async createProduct(product) {
        return await this.repository.insertProduct(product);
    }

    async updateProduct(updatedProduct) {
        return await this.repository.updateProduct(updatedProduct);
    }

    async deleteProduct(id: number) {
        return await this.repository.deleteProduct(id);
    }

    getProductImages(id: number) {
        const dir = "public/product-images/" + id;
        const files = fs.readdirSync(dir);
        return files;
    }

    async setPublished(id: number, published: boolean) {
        return await this.repository.setPublished(id, published);
    }
}