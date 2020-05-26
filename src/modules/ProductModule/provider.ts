import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";

import * as fs from "fs";
import * as rimraf from "rimraf";
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

    async addProduct(product) {
        await this.repository.insertProduct(product);
        return true;

    }

    async updateProduct(updatedProduct) {
        await this.repository.updateProduct(updatedProduct);
        return true;
    }

    async removeProduct(id: number) {
        rimraf.sync("public/product-images/" + id);
        await this.repository.delete(id);
        return true;
    }

    getProductImages(id: number) {
        const dir = "public/product-images/" + id;
        const files = fs.readdirSync(dir);
        return files;
    }
}