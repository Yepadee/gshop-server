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

        console.log(numProducts);

        if (numProducts > 0) throw new Error("Cannot delete a product type that still has products assigned!");

        await this.delete(id);
        return true;
    }
}