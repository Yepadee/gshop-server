import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { Stock } from '@entity/Stock';

@Injectable()
export class StockProvider {
    repository = getRepository(Stock);

    async getStock(productId, propertyValueIds) {
        const data = await this.repository.createQueryBuilder("stock")
        .select("DISTINCT(propertyCount.stockId)", "stockId")
        .from(qb => {
            const subQuery = qb.subQuery()
                .select("COUNT(*)", "propertyCount")
                .addSelect("stock.id", "stockId")
                .from(Stock, "stock")
                .innerJoin("stock.properties", "properties")
                .innerJoin("stock.product", "product")
                .where("product.id = :productId", {productId})
                .andWhere("properties.id IN (:...propertyValueIds)", {propertyValueIds})
                .groupBy("stock.id")
            return subQuery;
        }, "propertyCount")
        .where("propertyCount.propertyCount =:count", {count: propertyValueIds.length})
        .getRawOne();

        return this.repository.findOne(data.stockId);
    }
}