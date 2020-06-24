import { Repository, EntityRepository } from "typeorm";
import { ProductImage } from "@entity/ProductImage";


import * as fs from 'fs';

@EntityRepository(ProductImage)
export class ProductImageRepository extends Repository<ProductImage> {
    private async getNextPriority() {
        const { nextPriority } = await this.createQueryBuilder("productImage")
        .select("MAX(productImage.priority)", "nextPriority")
        .getRawOne();

        if (nextPriority) return nextPriority + 1;
        else return 1;
    }

    private storeFile(stream, path)
    {
        return new Promise((resolve, reject) => 
            stream
                .on("error", error => {
                    if (stream.truncated) {
                        fs.unlinkSync(path);
                    }
                    reject(error);
                })
                .pipe(fs.createWriteStream(path))
                .on('error', error => reject(error))
                .on('finish', () => resolve({ path }))
        );
    }

    async uploadProductImages(productId: number, files) {
        await Promise.all(files.map( async file => {
            const { filename, createReadStream } = await file;
            const stream = createReadStream();
            const path = "product-images/" + productId + "/" + filename;
            await this.storeFile(stream, "public/" + path);

            const productImage = new ProductImage();
            productImage.path = path;
            productImage.productId = productId;
            productImage.priority = await this.getNextPriority();

            await this.save(productImage);
        }));

        return true;
    }

    async deleteProductImage(imageId: number)
    {
        const image = await this.findOne(imageId);
        fs.unlinkSync("public/product-images/" + productId + "/" + filename);
        return true;
    }

}