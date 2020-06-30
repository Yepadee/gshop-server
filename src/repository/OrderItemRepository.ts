import { EntityRepository, Repository } from "typeorm";
import { OrderItem } from "@entity/OrderItem";


@EntityRepository(OrderItem)
export class OrderItemRepository extends Repository<OrderItem> {

    async getOrderItemsByPaymentOrderRef(paymentOrderRef: string) {
        return this.createQueryBuilder("orderItems")
        .innerJoin("orderItems.order", "order")
        .where("order.paymentOrderRef = :paymentOrderRef", { paymentOrderRef })
        .getMany();
    }
}