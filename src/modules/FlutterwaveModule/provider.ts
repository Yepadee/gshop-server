import { Injectable } from "@graphql-modules/di";
import { FlutterwaveRepository } from "@flutterwaveUtils"
import { getCustomRepository } from "typeorm";
import { StockRepository } from "@repository/StockRepository";
import { Currency } from "@forexUtils";


@Injectable()
export class FlutterwaveProvider {
    flutterWaveRepo = new FlutterwaveRepository();
    stockRepo = getCustomRepository(StockRepository);

    async createOrder(returnUrl: string, customerDetails, items, currency: Currency) {
        return this.stockRepo.checkOrderItemsInStock(items).then(async () => {
            return this.flutterWaveRepo.createOrder(returnUrl, customerDetails, items, currency);
        });
    }

    async verifyOrder(transactionRef: string, transactionId: string) {
        return this.flutterWaveRepo.verifyOrder(transactionRef, transactionId);
    }

}