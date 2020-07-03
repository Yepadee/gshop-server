import { Injectable } from "@graphql-modules/di";
import { PayPalRepository } from "@payPalUtils"
import { getCustomRepository } from "typeorm";
import { StockRepository } from "@repository/StockRepository";
import { Currency } from "@forexUtils";


@Injectable()
export class PayPalProvider {
    payPalRepo = new PayPalRepository();
    stockRepo = getCustomRepository(StockRepository);

    async createOrder(returnUrl: string, cancelUrl: string, shippingAddress, orderItems, currency: Currency) {
        return this.stockRepo.checkOrderItemsInStock(orderItems).then(() => {
            return this.payPalRepo.createOrder(returnUrl, cancelUrl, shippingAddress, orderItems, currency);
        });
    }

    async captureOrder(orderId: string) {
        return this.payPalRepo.getOrderItems(orderId).then(orderItems => {
            return this.stockRepo.checkOrderItemsInStock(orderItems).then(() => {
                return this.payPalRepo.captureOrder(orderId).then(() => {
                    return true;
                });
            });
        });
    }

}