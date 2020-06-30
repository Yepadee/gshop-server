import { Injectable } from "@graphql-modules/di";
import { PayPalRepository } from "@payPalUtils"
import { getCustomRepository } from "typeorm";
import { StockRepository } from "@repository/StockRepository";


@Injectable()
export class PayPalProvider {
    payPalRepo = new PayPalRepository();
    stockRepo = getCustomRepository(StockRepository);

    async createOrder(returnUrl: string, cancelUrl: string, shippingAddress, orderItems) {
        return this.stockRepo.checkOrderItemsInStock(orderItems).then(() => {
            return this.payPalRepo.createOrder(returnUrl, cancelUrl, shippingAddress, orderItems);
        });
    }

    async captureOrder(orderRef: string) {
        return this.payPalRepo.getOrderItems(orderRef).then(orderItems => {
            return this.stockRepo.checkOrderItemsInStock(orderItems).then(() => {
                return this.payPalRepo.captureOrder(orderRef).then(() => {
                    return true;
                });
            });
        });
    }

}