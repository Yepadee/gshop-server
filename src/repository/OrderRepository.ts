import { Order } from "@entity/Order";
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
}