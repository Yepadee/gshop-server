import { Injectable } from "@graphql-modules/di";

import { getRepository, getCustomRepository } from "typeorm";
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
        await this.repository.insertPropertyName(name);
        return true;
    }

    async removePropertyName(id: number) {
        await this.repository.delete(id);
        return true;
    }
}