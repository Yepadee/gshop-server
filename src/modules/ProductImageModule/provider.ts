import { Injectable } from "@graphql-modules/di";
import { getCustomRepository } from "typeorm";
import { ProductImageRepository } from "@repository/ProductImageRepository";

@Injectable()
export class ProductImageProvider {

    repository = getCustomRepository(ProductImageRepository);

    getProductImages(productId: number) {
        return this.repository.getProductImages(productId);
    }

    async uploadProductImages(productId: number, files) {
        return this.repository.uploadProductImages(productId, files);
    }

    deleteProductImage(id: number) {
        return this.repository.deleteProductImage(id);
    }

    updateProductImagePriority(id: number, priority: number) {
        return this.repository.updateProductImagePriority(id, priority)
    }

}