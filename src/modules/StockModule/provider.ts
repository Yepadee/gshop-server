import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { Stock } from '@entity/Stock';

@Injectable()
export class StockProvider {
    repository = getRepository(Stock);

    getStock(args) {
        return this.repository.createQueryBuilder("stock")
        .innerJoinAndSelect("stock.properties", "properties")
        .where(args.id ? 'stock.id = :stockId' : '1=1', {stockId: args.id})
        .getMany();
    }

    getStockById(id: number) {
        return this.repository.findOne(id);
    }
}