import { EntityRepository, Repository } from "typeorm";
import { PropertyName } from "@entity/PropertyName";

@EntityRepository(PropertyName)
export class PropertyNameRepository extends Repository<PropertyName> {

    async insertPropertyName(name: string) {
        const propertyName = new PropertyName();
        propertyName.name = name;
        await this.save(propertyName);
        return true;
    }

    async deletePropertyName(id: number) {
        const { numValues } = await this.createQueryBuilder("propertyName")
        .select("COUNT(*)", "numValues")
        .innerJoin("propertyName.propertyValues", "propertyValues")
        .where("propertyName.id = :id", {id})
        .getRawOne();

        const { numProductTypes } = await this.createQueryBuilder("propertyName")
        .select("COUNT(*)", "numProductTypes")
        .innerJoin("propertyName.productTypes", "productTypes")
        .where("propertyName.id = :id", {id})
        .getRawOne();

        if (numValues > 0) throw new Error("Cannot remove a property name that still has values assigned!");
        if (numProductTypes > 0) throw new Error("Cannot remove a property name that is still assigned to a product type!");
        
        await this.delete(id);

        return true;
    }

}