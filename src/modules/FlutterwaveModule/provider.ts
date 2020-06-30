import { Injectable } from "@graphql-modules/di";
import { FlutterwaveRepository } from "@flutterwaveUtils"
import { getCustomRepository } from "typeorm";
import { StockRepository } from "@repository/StockRepository";


@Injectable()
export class FlutterwaveProvider {
    flutterWaveRepo = new FlutterwaveRepository();
    stockRepo = getCustomRepository(StockRepository);

    async createOrder(returnUrl: string, items, customerDetails) {
        return this.stockRepo.checkOrderItemsInStock(items).then(async () => {
            return this.flutterWaveRepo.createOrder(returnUrl, items, customerDetails);
        });
    }

    async verifyOrder(transactionRef: string, transactionId: string) {
        return this.flutterWaveRepo.verifyOrder(transactionRef, transactionId);
    }

}