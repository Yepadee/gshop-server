import { ProductType } from "@entity/ProductType";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ProductType)
export class ProductTypeRepository extends Repository<ProductType> {
    async insertProductType(name, propertyNameIds)
    {
        const productType = new ProductType();
        productType.name = name;
        productType.propertyNames = propertyNameIds.map(propertyNameId => <any>{id: propertyNameId});
        await this.save(productType);
    }
}