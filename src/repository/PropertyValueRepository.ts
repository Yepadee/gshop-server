import { EntityRepository, Repository } from "typeorm";
import { PropertyValue } from "@entity/PropertyValue";

@EntityRepository(PropertyValue)
export class PropertyValueRepository extends Repository<PropertyValue> {
    async insertPropertyValue(propertyNameId, value)
    {
        const propertyValue = new PropertyValue();
        propertyValue.value = value;
        propertyValue.propertyNameId = propertyNameId;

        await this.save(propertyValue);

        return true;
    }

    async deletePropertyValue(propertyValueId)
    {   
        const data = await this.createQueryBuilder("propertyValue")
        .select("COUNT(*) > 0", "hasStock")
        .addSelect("propertyValue.id")
        .innerJoin("propertyValue.stock", "stock")
        .where("propertyValue.id = :propertyValueId", { propertyValueId })
        .getRawOne();

        if (data.hasStock == '1') throw new Error("Cannot remove value if there exists stock with this value.");

        await this.delete(propertyValueId);
        return true;
    }
}