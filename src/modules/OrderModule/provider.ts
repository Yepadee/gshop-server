import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";
import { OrderRepository } from "@repository/OrderRepository";
import { Order, PaymentMethod } from "@entity/Order";


@Injectable()
export class OrderProvider {
    repository = getCustomRepository(OrderRepository);

    getOrders(args) {
        return this.repository.find({ where: args });
    }

    getOrderById(id: number) {
        return this.repository.find({ where: { id } });
    }

    async setOrderStatus(id: number, status: string) {
        return await this.repository.setStatus(id, status);
    }

    async setSupplierOrderId(id: number, newStatus: string) {
        return await this.repository.setStatus(id, newStatus);
    }

    getTransactionPath(order: Order) {
        switch (order.paymentMethod) {
            case PaymentMethod.PAYPAL:
                if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
                    return "https://www.sandbox.paypal.com/activity/payment/" + order.paymentOrderId;
                } else {
                    return "https://www.paypal.com/activity/payment/" + order.paymentOrderId;
                }

            case PaymentMethod.FLUTTERWAVE:
                return "https://dashboard.flutterwave.com/dashboard/transactions/" + order.paymentOrderId;
        }
    }
}