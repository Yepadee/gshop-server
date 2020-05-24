import { Injectable } from "@graphql-modules/di";

import { ReadStream } from "typeorm/platform/PlatformTools";
import * as fs from 'fs';

@Injectable()
export class ProductImageProvider {

    async uploadProductImages(productId, files)
    {
        await Promise.all(files.map( async file => {
            const { filename, createReadStream } = await file;
            const stream : ReadStream = createReadStream();
            const outStream = fs.createWriteStream("public/product-images/" + productId + "/" + filename);
            await stream.pipe(outStream);
        }));
        
        return true;
    }
}