import { Order, PaymentMethod, OrderStatus } from "@entity/Order";
import { EntityRepository, Repository } from "typeorm";
import { OrderItem } from "@entity/OrderItem";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

    getOrders(paymentMethod, status, take, skip) {
        return this.createQueryBuilder("products")
        .limit(take)
        .offset(skip)
        .andWhere(paymentMethod ? "paymentMethod = :paymentMethod" : '1=1', { paymentMethod })
        .andWhere(status ? "status = :status" : '1=1', { status })
        .getMany();
    }

    getOrderByPaymentOrderRef(paymentOrderRef: string) {
        return this.findOne({where: { paymentOrderRef }});
    }

    async confirmOrder(paymentOrderRef: string, paymentTransactionId: string) {
        const now: Date = new Date();
        return this.createQueryBuilder()
        .update(Order)
        .set({ dateConfirmed: now, status: OrderStatus.NEW, paymentTransactionId })
        .where("paymentOrderRef = :paymentOrderRef", { paymentOrderRef })
        .execute().then(() => {
            return true;
        });
    }

    async setStatus(id: number, newStatus: string) {
        return this.createQueryBuilder()
        .update(Order)
        .set({status: newStatus})
        .where("id = :id", {id})
        .execute().then(() => {
            return true;
        });
    }

    async setSupplierOrderId(id: number, orderId: string) {
        return this.createQueryBuilder()
        .update(Order)
        .set({supplierOrderId: orderId})
        .where("id = :id", {id})
        .execute().then(() => {
            return true;
        });
    }

    async insertOrder(
        paymentOrderRef: string,
        paymentMethod: PaymentMethod,
        orderItems,
        amountPaid: number,
        currency: string
    ) {
        const order = new Order();
        order.paymentOrderRef = paymentOrderRef;
        order.paymentMethod = paymentMethod;
        order.items = orderItems.map(item => {
            const orderItem = new OrderItem();
            orderItem.quantity = item.quantity;
            orderItem.stock = <any>{id: item.stockId};
            return orderItem;
        });
        order.currencyPaid = currency;
        order.amountPaid = amountPaid;

        return this.save(order).then(() => {
            return true;
        });
    }
}