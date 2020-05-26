import { EntityRepository, Repository } from "typeorm";
import { PropertyName } from "@entity/PropertyName";

@EntityRepository(PropertyName)
export class PropertyNameRepository extends Repository<PropertyName> {

    async insertPropertyName(name: string) {
        const propertyName = new PropertyName();
        propertyName.name = name;
        await this.save(propertyName);
    }

}