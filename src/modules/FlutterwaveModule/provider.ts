import { Injectable } from "@graphql-modules/di";
import { FlutterwaveRepository } from "@flutterwaveUtils"
import { getCustomRepository } from "typeorm";
import { StockRepository } from "@repository/StockRepository";


@Injectable()
export class FlutterwaveProvider {
    flutterWaveRepo = new FlutterwaveRepository();
    stockRepo = getCustomRepository(StockRepository);

    async createOrder(orderItems, returnUrl: string, cancelUrl: string) {
        await this.stockRepo.checkOrderItemsInStock(orderItems);
        return this.flutterWaveRepo.createOrder();
    }

}