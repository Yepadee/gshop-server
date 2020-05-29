import { EntityRepository, Repository } from "typeorm";
import { Address } from "@entity/Address";

@EntityRepository(Address)
export class AddressRepository extends Repository<Address> {
}