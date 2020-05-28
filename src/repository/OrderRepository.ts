import { Order } from "@entity/Order";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
}