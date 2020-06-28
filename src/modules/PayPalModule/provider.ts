import { Injectable } from "@graphql-modules/di";
import { PayPalRepository } from "@payPalUtils"
import { getCustomRepository } from "typeorm";
import { StockRepository } from "@repository/StockRepository";


@Injectable()
export class PayPalProvider {
    payPalRepo = new PayPalRepository();
    stockRepo = getCustomRepository(StockRepository);

    async createOrder(returnUrl: string, cancelUrl: string, shippingAddress, orderItems) {
        await this.stockRepo.checkOrderItemsInStock(orderItems);
        return this.payPalRepo.createOrder(returnUrl, cancelUrl, shippingAddress, orderItems);
    }

    async captureOrder(orderId: string) {
        const orderItems = await this.payPalRepo.getOrderItems(orderId);

        await this.stockRepo.checkOrderItemsInStock(orderItems);
        await this.payPalRepo.captureOrder(orderId);
        await this.payPalRepo.finaliseOrder(orderId);

        return true;
    }

}