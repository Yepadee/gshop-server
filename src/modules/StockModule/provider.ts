import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { Stock } from '@entity/Stock';
import { Product } from "@entity/Product";
import { PropertyValue } from "@entity/PropertyValue";

@Injectable()
export class StockProvider {
    repository = getRepository(Stock);
    productRepository = getRepository(Product);
    propertyValueRepository = getRepository(PropertyValue);

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
        if(await this.getStockQuantity(args.productId, args.propertyIds)) throw new Error("Stock for this product with these properties already exist.");
        const allValidProperties = await args.propertyIds.reduce(async (acc: boolean, propertyValueId) => {
            const data = await this.productRepository.createQueryBuilder("product")
            .select("COUNT(*) > 0", "isValidProperty")
            .innerJoin("product.requiredProperties", "requiredProperties")
            .innerJoin("requiredProperties.propertyValues", "propertyValues")
            .where("product.id = :productId", {productId: args.productId})
            .andWhere("propertyValues.id = :propertyValueId", { propertyValueId })
            .getRawOne();
            
           if (data.isValidProperty == '1') return acc;
           else return false;
        }, true);
        if (!allValidProperties) throw new Error("One or more of the properties selected are not accosiated with this product.");

        const noDuplicateValues = await this.propertyValueRepository.createQueryBuilder("propertyValue")
        .select("COUNT(DISTINCT(propertyName.id)) = COUNT(*)", "value")
        .innerJoin("propertyValue.propertyName", "propertyName")
        .where("propertyValue.id IN (:propertyValueIds)", {propertyValueIds: args.propertyIds})
        .getRawOne();

        if (noDuplicateValues.value == '0') throw new Error("Cannot assign more than one proprty of the same type.");

        const stock = new Stock();
        stock.productId = args.productId;
        stock.properties = args.propertyIds.map((propertyId) => <any>{id: propertyId});
        stock.quantity = args.quantity;

        await this.repository.save(stock);
        
        return true;
    }

    async updateStockQuantity(id: number, quantity: number) {
        await this.repository.createQueryBuilder()
        .update(Stock)
        .set({quantity})
        .where("id = :id", {id})
        .execute();

        return true;
    }

    async deleteStock(id: number)
    {
        await this.repository.delete(id);
        return true;
    }
}