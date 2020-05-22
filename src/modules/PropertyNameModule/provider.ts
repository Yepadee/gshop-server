import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { PropertyName } from '@entity/PropertyName';

@Injectable()
export class PropertyNameProvider {
    repository = getRepository(PropertyName);

    getPropertyNames(args) {
        return this.repository.find({where: args});
    }

    getPropertyNameById(id: number) {
        return this.repository.findOne({where: {id}});
    }

    async addPropertyName(name: string) {
        const propertyName = new PropertyName();
        propertyName.name = name;
        await this.repository.save(propertyName);

        return true;
    }

    async removePropertyName(id: number) {
        await this.repository.delete(id);
        return true;
    }
}