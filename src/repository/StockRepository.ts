import { EntityRepository, Repository, getRepository, In, MoreThan } from "typeorm";
import { Stock } from "@entity/Stock";
import { Product } from "@entity/Product";
import { PropertyValue } from "@entity/PropertyValue";
import { Currency, CurrencyConverter } from "@forexUtils";
import { OrderItem } from "@entity/OrderItem";

@EntityRepository(Stock)
export class StockRepository extends Repository<Stock> {
    productRepository = getRepository(Product);
    propertyValueRepository = getRepository(PropertyValue);
    currencyConverter = new CurrencyConverter();
    
    async parseOrderItems(orderItems, itemParser, currency: Currency) {
        const ids = orderItems.map(item => {
            return item.stockId;
        });

        const orderItemsInfo = await this.getOrderItemsDetails(ids, currency);
        const itemQuantityMap = this.buildItemQuantityMap(orderItems);
        const totalValue = orderItemsInfo.reduce((acc: number, item: any) => acc + item.price * itemQuantityMap[item.stockId], 0);
        const parsedItems = await Promise.all(orderItemsInfo.map((orderItemInfo: any) =>
            itemParser(orderItemInfo, itemQuantityMap[orderItemInfo.stockId], currency)
        ));
    
        return { parsedItems, totalValue };
    }

    private async getStockQuantity(productId: number, propertyValueIds: number[]) {
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

        return true;
    }

    async updateStockQuantity(id: number, quantity: number) {
        await this.createQueryBuilder()
        .update(Stock)
        .set({quantity})
        .where("id = :id", {id})
        .execute();

        return true;
    }

    async getOrderItemsDetails(ids: number[], currency: Currency) {
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

        const stockInfo = await Promise.all(stock.map( async item => {
            const properties = item.__properties__;
            const product = item.__product__;
            const productType = product.__type__;
            
            return {
                stockId: item.id,
                type: productType.name,
                name: product.name,
                price: await this.currencyConverter.convertPrice(currency, product.price),
                properties: properties.map( property => property.value ),
            }
        }));
        
        return stockInfo;
    }

    async incrementStockQuantity(id: number, delta: number) {
        await this.createQueryBuilder()
        .update(Stock)
        .set({ quantity: () => "quantity + " + delta })
        .where("id = :id", {id})
        .execute();
        return true;
    }

    async decrementStockQuantity(id: number, delta: number) {
        await this.createQueryBuilder()
        .update(Stock)
        .set({ quantity: () => "quantity - " + delta })
        .where("id = :id", {id})
        .execute();
        return true;
    }

    async sellStock(id: number, quantity: number) {
        return this.decrementStockQuantity(id, quantity).then(async () => {
            return this.createQueryBuilder().update(Stock)
            .set({ sales: () => "sales + " + quantity })
            .where("id = :id", {id})
            .execute().then(() => {
                return true;
            });
        });
    }

    async getAvailableStock(productId: number) {
        const stock = await this.find({
            where: { productId, quantity: MoreThan(0) },
        });
        return stock;
    }

    async checkOrderItemsInStock(orderItems: OrderItem[]) {
        const ids = orderItems.map((orderItem: OrderItem) => orderItem.stockId);
        const itemQuantityMap = {};
        orderItems.forEach(orderItem => {
            itemQuantityMap[orderItem.stockId] = orderItem.quantity;
        });
        const stocks = await this.find({ where: {id: In(ids)} });
        stocks.forEach(stock => {
            const quantity = itemQuantityMap[stock.id];
            if(quantity > stock.quantity) throw new Error("Not enough stock to fulfill order!");
        });
    }

    buildItemQuantityMap(orderItems) {
        const itemQuantityMap = {};
        orderItems.forEach(orderItem => {
            itemQuantityMap[orderItem.stockId] = orderItem.quantity;
        });
        return itemQuantityMap
    }

}