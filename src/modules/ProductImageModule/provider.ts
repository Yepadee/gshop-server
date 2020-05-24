import { Injectable } from "@graphql-modules/di";

import * as fs from 'fs';

@Injectable()
export class ProductImageProvider {

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

    async uploadProductImages(productId, files)
    {
        await Promise.all(files.map( async file => {
            const { filename, createReadStream } = await file;
            const stream = createReadStream();
            const path = "public/product-images/" + productId + "/" + filename;

            await this.storeFile(stream, path);

            
        }));

        return true;
    }

    deleteProductImage(productId, filename)
    {
        fs.unlinkSync("public/product-images/" + productId + "/" + filename);
        return true;
    }
}