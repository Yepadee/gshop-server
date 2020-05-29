import { Injectable } from "@graphql-modules/di";

import { CustomerRepository } from "@repository/CustomerRepository";
import { getCustomRepository } from "typeorm";

@Injectable()
export class CustomerProvider {
    repository = getCustomRepository(CustomerRepository);

    getCustomers(args) {
        return this.repository.find({where: args});
    }

    getCustomerById(id) {
        return this.repository.findOne(id);
    }

}