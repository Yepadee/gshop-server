import { Repository, EntityRepository } from "typeorm";
import { ProductImage } from "@entity/ProductImage";
import { uuid } from 'uuidv4';

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

    async getProductImages(productId) {
        const result = await this.createQueryBuilder("productImage")
        .innerJoin("productImage.product", "product") 
        .where("product.id = :productId", { productId })
        .orderBy("productImage.priority", "ASC")
        .getMany();
        return result;
    }

    async uploadProductImages(productId: number, files) {
        await Promise.all(files.map( async file => {
            const { filename, createReadStream } = await file;
            const stream = createReadStream();
            const path = "product-images/" + productId + "/" + uuid() + "-" + filename;
            await this.storeFile(stream, "public/" + path);

            const productImage = new ProductImage();
            productImage.path = path;
            productImage.productId = productId;
            productImage.priority = await this.getNextPriority();

            await this.save(productImage);
        }));

        return true;
    }

    async deleteProductImage(id: number) {
        try {
            const { path } = await this.createQueryBuilder("productImage")
            .select("productImage.path", "path")
            .where("productImage.id = :id", { id })
            .getRawOne();

            await this.createQueryBuilder("productImage")
            .select("productImage.priority", "oldPriority")
            .where("productImage.id = :id", { id })
            .getRawOne().then(({ oldPriority }) => {
                this.delete(id).then(() => {
                    fs.unlinkSync("public/" + path);
                    this.createQueryBuilder()
                    .update()
                    .set({
                        priority: () => `priority - 1`
                    })
                    .where("priority > :oldPriority", { oldPriority })
                    .execute();
                });
            });

        } catch {
            throw new Error("Invalid productImage id!");
        }

        return true;
    }

    async updateProductImagePriority(id: number, newPriority: number) {
        const maxImagePriority = await this.getNextPriority() - 1;
        if (maxImagePriority == 0) throw new Error("No images to update!");
        if (newPriority > maxImagePriority) {
            throw new Error("Updated image priority must be in range [1-" + maxImagePriority + "]!");
        }
        await this.createQueryBuilder("productImage")
        .select("productImage.priority", "oldPriority")
        .where("productImage.id = :id", { id })
        .getRawOne().then(({ oldPriority }) => {
            const sign = Math.sign(newPriority - oldPriority);
            this.createQueryBuilder()
            .update()
            .set({
                priority: () => `priority - ${sign}`
            })
            .where(sign > 0 ?
                "priority > :oldPriority":
                "priority < :oldPriority", { oldPriority })
            .andWhere(sign > 0 ?
                "priority <= :newPriority":
                "priority >= :newPriority", { newPriority })
            .execute().then(() => {
                    this.createQueryBuilder()
                    .update()
                    .set({
                        priority: newPriority
                    })
                    .where("id = :id", { id })
                    .execute();
                }
            );
        });

        return true;
    }

}