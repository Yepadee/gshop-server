import { Customer } from "@entity/Customer";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
}