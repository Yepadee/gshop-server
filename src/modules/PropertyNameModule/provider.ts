import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";
import { PropertyNameRepository } from "@repository/PropertyNameRepository";

@Injectable()
export class PropertyNameProvider {
    repository = getCustomRepository(PropertyNameRepository);

    getPropertyNames(args) {
        return this.repository.find({where: args});
    }

    getPropertyNameById(id: number) {
        return this.repository.findOne({where: {id}});
    }

    async addPropertyName(name: string) {
        return await this.repository.insertPropertyName(name);
    }

    async deletePropertyName(id: number) {
        return await this.repository.deletePropertyName(id);
    }
}