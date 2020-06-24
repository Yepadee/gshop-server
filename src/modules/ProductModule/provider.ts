import { Injectable } from "@graphql-modules/di";
import { getCustomRepository } from "typeorm";
import { ProductRepository } from "@repository/ProductRepository";

@Injectable()
export class ProductProvider {
    repository = getCustomRepository(ProductRepository);

    async getProducts(categoryId: number, take: number, skip: number, keyword: string, orderBy) {
        return this.repository.getProducts(categoryId, take, skip, keyword, orderBy)
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