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

        if (data) return data.quantity;
        else return data;
    }

    async addStock(args) {
        if(await this.getStockQuantity(args.productId, args.propertyIds)) return false;

        const stock = new Stock();
        stock.productId = args.productId;
        stock.properties = args.propertyIds.map((propertyId) => <any>{id: propertyId});
        stock.quantity = args.quantity;

        await this.repository.save(stock);
        
        return true;
    }

    async updateStockQuantity(stockId: number, quantity: number) {
        await this.repository.createQueryBuilder()
        .update(Stock)
        .set({quantity})
        .where("id = :stockId", {stockId})
        .execute();

        return true;
    }

    async deleteStock(stockId: number)
    {
        await this.repository.delete(stockId);
        return true;
    }
}