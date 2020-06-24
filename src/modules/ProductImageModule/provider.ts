import { Injectable } from "@graphql-modules/di";
import { getCustomRepository } from "typeorm";
import { ProductImageRepository } from "@repository/ProductImageRepository";

@Injectable()
export class ProductImageProvider {

    repository = getCustomRepository(ProductImageRepository);

    async uploadProductImages(productId: number, files)
    {
        return this.repository.uploadProductImages(productId, files);
    }

    deleteProductImage(imageId: number)
    {
        return this.repository.deleteProductImage(imageId);
    }
}