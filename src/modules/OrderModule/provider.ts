import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";
import { OrderRepository } from "@repository/OrderRepository";

@Injectable()
export class OrderProvider {
    repository = getCustomRepository(OrderRepository);

    getOrders(args) {
        return this.repository.find({ where: args });
    }

    getOrderById(id) {
        return this.repository.find({ where: {id}});
    }

    async updateOrderStatus(id, newStatus) {
        await this.repository.updateStatus(id, newStatus);
        return true;
    }
}