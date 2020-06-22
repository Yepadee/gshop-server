import { Injectable } from "@graphql-modules/di";

import { getCustomRepository, Like } from "typeorm";

import * as fs from "fs";
import { ProductRepository } from "@repository/ProductRepository";

@Injectable()
export class ProductProvider {
    repository = getCustomRepository(ProductRepository);

    async getProducts(take: number, skip: number, keyword: string) {
        keyword = keyword || '';
        const [ result ] = await this.repository.findAndCount({
            where: {
                        published:true,
                        name: Like('%' + keyword + '%'),
                        order: { name: "DESC" }
                   },
            take,
            skip
        });

        return result;
    }

    getAllProducts(args) {
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

    async addProductRequiredProperties(id: number, propertyNameIds: number[]) {
        return await this.repository.addProductRequiredProperties(id, propertyNameIds);
    }

    async removeProductRequiredProperties(id: number, propertyNameIds: number[]) {
        return await this.repository.removeProductRequiredProperties(id, propertyNameIds);
    }
}