import { Injectable } from "@graphql-modules/di";
import { PayPalRepository } from "@payPalUtils"


@Injectable()
export class PayPalProvider {
    payPalRepo = new PayPalRepository();

    async createOrder(orderItems, returnUrl: string, cancelUrl: string) {
        await this.payPalRepo.checkOrderItemsInStock(orderItems);
        return this.payPalRepo.createOrder(orderItems, returnUrl, cancelUrl);
    }

    async captureOrder(orderId: string) {
        const orderItems = await this.payPalRepo.getOrderItems(orderId);

        await this.payPalRepo.checkOrderItemsInStock(orderItems);
        await this.payPalRepo.captureOrder(orderId);
        await this.payPalRepo.finaliseOrder(orderId);

        return true;
    }

    async getOrderItemsDetails(orderId: string) {
        return this.payPalRepo.getOrderItemsDetails(orderId);
    }

}