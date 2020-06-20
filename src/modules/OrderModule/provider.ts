import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";
import { OrderRepository } from "@repository/OrderRepository";

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
}