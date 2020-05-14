import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { Stock } from '@entity/Stock';

@Injectable()
export class StockProvider {
    repository = getRepository(Stock);

    async getStockQuantity(productId, propertyValueIds) {
        const data = await this.repository.createQueryBuilder("stock")
        .select("DISTINCT(propertyCount.quantity)", "quantity")
        .from(qb => {
            const subQuery = qb.subQuery()
                .select("COUNT(*)", "propertyCount")
                .addSelect("stock.quantity", "quantity")
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

        return data.quantity;
    }
}