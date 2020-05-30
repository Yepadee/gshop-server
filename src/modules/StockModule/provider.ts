import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";
import { StockRepository } from "@repository/StockRepository";

@Injectable()
export class StockProvider {
    repository = getCustomRepository(StockRepository);

    async getStockQuantity(productId, propertyValueIds) {
        const data = await this.repository.getStockQuantity(productId, propertyValueIds);
        if (data) return data.quantity;
        else return data;
    }

    async itemInStock(productId, propertyValueIds)
    {
        const stockCount = await this.repository.getStockQuantity(productId, propertyValueIds);
        return parseInt(stockCount) > 0;
    }

    async addStock(args) {
        await this.repository.insertStock(args);
        return true;
    }

    async updateStockQuantity(id: number, quantity: number) {
        await this.repository.updateStockQuantity(id, quantity);
        return true;
    }

    async removeStock(id: number)
    {
        await this.repository.delete(id);
        return true;
    }

    async getAvailableStock(productId: number)
    {
        return this.repository.getAvailableStock(productId);
    }
}