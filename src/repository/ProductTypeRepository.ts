import { ProductType } from "@entity/ProductType";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ProductType)
export class ProductTypeRepository extends Repository<ProductType> {
    async insertProductType(name: string, propertyNameIds: number[])
    {
        const productType = new ProductType();
        productType.name = name;
        productType.propertyNames = <any> propertyNameIds.map(propertyNameId => <any>{id: propertyNameId});

        await this.save(productType);
    }

    async deleteProductType(id: number)
    {
        const { numProducts } = await this.createQueryBuilder("productType")
        .select("COUNT(*)", "numProducts")
        .innerJoin("productType.products", "products")
        .where("productType.id = :id", {id})
        .getRawOne();

        if (numProducts > 0) throw new Error("Cannot delete a product type that still has products assigned!");

        await this.delete(id);
        return true;
    }

    async addPropertyNames(id: number, propertyNameIds: number[]) {
        await this.createQueryBuilder()
        .relation(ProductType, "propertyNames")
        .of(id)
        .add(propertyNameIds)
        return true;
    }

    async removePropertyNames(id: number, propertyNameIds: number[]) {
        const { numProducts } = await this.createQueryBuilder("productType")
        .select("COUNT(DISTINCT products.id)", "numProducts")
        .innerJoin("productType.products", "products")
        .innerJoin("products.requiredProperties", "requiredProperties")
        .where("requiredProperties.id IN (:...propertyNameIds)", { propertyNameIds })
        .andWhere("productType.id = :id", { id })
        .getRawOne();

        if (numProducts > 0) {
            throw new Error("Cannot remove a property-name from a type if assigned as a required-property to one of its products.");
        }

        await this.createQueryBuilder()
        .relation(ProductType, "propertyNames")
        .of(id)
        .remove(propertyNameIds)
        return true;
    }

}