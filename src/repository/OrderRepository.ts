import { Order } from "@entity/Order";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    async updateStatus(id: string, newStatus: string) {
        await this.createQueryBuilder()
        .update(Order)
        .set({status: newStatus})
        .where("id = :id", {id})
        .execute();
    }
}