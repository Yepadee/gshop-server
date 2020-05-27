import { Injectable } from "@graphql-modules/di";
import { PayPalRepository } from "@payPalUtils"



@Injectable()
export class PayPalProvider {
    payPalRepo = new PayPalRepository();

    async createOrder(orderItems) {
        this.payPalRepo.checkOrderItemsInStock(orderItems);
        return this.payPalRepo.createOrder(orderItems);
    }

    async captureOrder(orderId: string) {
        //TODO: CHECK STOCK COUNT
        const orderItems = await this.payPalRepo.getOrderItems(orderId);
        await this.payPalRepo.checkOrderItemsInStock(orderItems);
        try {
            await this.payPalRepo.captureOrder(orderId);
        } catch (error){
            throw error;
        }
        await this.payPalRepo.deductStockFromOrder(orderId);
        
        return true;
    }

    async getOrderItemsDetails(orderId: string) {
        return this.payPalRepo.getOrderItemsDetails(orderId);
    }

}