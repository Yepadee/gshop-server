import { Injectable } from "@graphql-modules/di";

import { PayPalRepository } from "@payPalUtils";

@Injectable()
export class OrderItemProvider {
    repository = new PayPalRepository();

    getItemsByPayPalOrderId(orderId: string) {
        return this.repository.getOrderItemsDetails(orderId);
    }

}