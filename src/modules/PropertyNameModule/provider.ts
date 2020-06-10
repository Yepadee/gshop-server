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
        const result = await this.repository.insertPropertyName(name);
        return result.id;
    }

    async removePropertyName(id: number) {
        await this.repository.delete(id);
        return true;
    }
}