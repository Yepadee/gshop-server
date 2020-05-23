import { Injectable } from "@graphql-modules/di";

import { ReadStream } from "typeorm/platform/PlatformTools";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductImageProvider {

    async uploadImage(name, file)
    {
        const { filename, createReadStream } = await file;
        const stream : ReadStream = createReadStream();
        const outStream = fs.createWriteStream("files/images/" + name + path.extname(filename));
        stream.pipe(outStream);
        return true;
    }
}