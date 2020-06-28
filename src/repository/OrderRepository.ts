import { Order, PaymentMethod } from "@entity/Order";
import { Address } from "@entity/Address";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    async setStatus(id: number, newStatus: string) {
        await this.createQueryBuilder()
        .update(Order)
        .set({status: newStatus})
        .where("id = :id", {id})
        .execute();

        return true;
    }

    async setSupplierOrderId(id: number, orderId: string) {
        await this.createQueryBuilder()
        .update(Order)
        .set({supplierOrderId: orderId})
        .where("id = :id", {id})
        .execute();

        return true;
    }

    async insertOrder(paymentOrderId: string, shippingAddress, paymentMethod: PaymentMethod, orderItems) {
        const address = new Address();
        address.name = shippingAddress.name;
        address.line1 = shippingAddress.line1;
        address.line2 = shippingAddress.line2;
        address.adminArea2 = shippingAddress.adminArea2;
        address.adminArea1 = shippingAddress.adminArea1;
        address.postalCode = shippingAddress.postalCode;
        address.countryCode = shippingAddress.countryCode;

        // Save order details
        const order = new Order();
        order.paymentOrderId = paymentOrderId;
        order.paymentMethod = paymentMethod;
        order.items = orderItems;
        order.shippingAddress = address;

        await this.save(order);
    }
}