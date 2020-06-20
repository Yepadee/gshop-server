import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";
import { StockRepository } from "@repository/StockRepository";

@Injectable()
export class StockProvider {
    repository = getCustomRepository(StockRepository);

    async addStock(args) {
        return await this.repository.insertStock(args);
    }

    async updateStockQuantity(id: number, quantity: number) {
        return await this.repository.updateStockQuantity(id, quantity);
    }

    async deleteStock(id: number)
    {
        return await this.repository.delete(id);
    }

    async getAvailableStock(productId: number)
    {
        return this.repository.getAvailableStock(productId);
    }
}