import { EntityRepository, Repository, getRepository, In } from "typeorm";
import { Stock } from "@entity/Stock";
import { Product } from "@entity/Product";
import { PropertyValue } from "@entity/PropertyValue";

@EntityRepository(Stock)
export class StockRepository extends Repository<Stock> {
    productRepository = getRepository(Product);
    propertyValueRepository = getRepository(PropertyValue);

    async getStockQuantity(productId, propertyValueIds) {
        const data = await this.createQueryBuilder("stock")
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

    async itemInStock(productId, propertyValueIds) {
        const stockCount = await this.getStockQuantity(productId, propertyValueIds);
        return parseInt(stockCount) > 0;
    }

    async insertStock(args) {
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

        await this.save(stock);
    }

    async updateStockQuantity(id: number, quantity: number) {
        await this.createQueryBuilder()
        .update(Stock)
        .set({quantity})
        .where("id = :id", {id})
        .execute();
    }

    async getOrderItemsDetails(ids: number[]) {
        const stock = <any> await this.find({
            where: { id : In(ids) },
            join: {
                alias: "stock",
                leftJoinAndSelect: {
                    "properties":"stock.properties",
                    "product":"stock.product",
                    "productType":"product.type"
                }
            }
        });

        const stockInfo = stock.map(item => {
            const properties = item.__properties__;
            const product = item.__product__;
            const productType = product.__type__;
            
            return {
                stockId: item.id,
                type: productType.name,
                name: product.name,
                price: parseFloat(product.price),
                properties: properties.map( property => property.value ),
            }
        });
        
        return stockInfo;
    }

    async incrementStockQuantity(id: number, delta: number) {
        await this.createQueryBuilder()
        .update(Stock)
        .set({ quantity: () => "quantity + " + delta })
        .where("id = :id", {id})
        .execute();
    }

    async decrementStockQuantity(id: number, delta: number) {
        await this.createQueryBuilder()
        .update(Stock)
        .set({ quantity: () => "quantity - " + delta })
        .where("id = :id", {id})
        .execute();
    }
}