import { EntityRepository, Repository } from "typeorm";
import { PropertyValue } from "@entity/PropertyValue";

@EntityRepository(PropertyValue)
export class PropertyValueRepository extends Repository<PropertyValue> {
    async insertPropertyValue(propertyNameId: number, value: string) {
        const propertyValue = new PropertyValue();
        propertyValue.value = value;
        propertyValue.propertyNameId = propertyNameId;

        await this.save(propertyValue);
        return true;
    }

    async deletePropertyValue(propertyValueId: number) {   
        const { hasStock } = await this.createQueryBuilder("propertyValue")
        .select("COUNT(*) > 0", "hasStock")
        .addSelect("propertyValue.id")
        .innerJoin("propertyValue.stock", "stock")
        .where("propertyValue.id = :propertyValueId", { propertyValueId })
        .getRawOne();

        if (hasStock == '1') throw new Error("Cannot remove value if there exists stock with this value.");

        await this.delete(propertyValueId);
        return true;
    }
}