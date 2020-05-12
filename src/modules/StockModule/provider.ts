import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { Stock } from '@entity/Stock';

@Injectable()
export class StockProvider {
    repository = getRepository(Stock);
    getStock(args) {
        return this.repository.find({ where: args });
    }
    getStockById(id: number) {
        return this.repository.findOne(id);
    }
}