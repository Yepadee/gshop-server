import { EntityRepository, Repository, getRepository } from "typeorm";
import { Product } from "@entity/Product";
import { ProductType } from "@entity/ProductType";


@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

    productTypeRepository = getRepository(ProductType);

    async insertProduct(product) {
        const data = await this.productTypeRepository.createQueryBuilder("productType")
        .select("propertyNames.id")
        .innerJoin("productType.propertyNames", "propertyNames")
        .where("productType.id = :typeId", {typeId: product.typeId})
        .getRawMany();
        const stripped = data.map(rowPacket => rowPacket.propertyNames_id.toString());

        if (product.requiredPropertyIds.every(id => stripped.includes(id)))
        {
            const newProduct = new Product();
            newProduct.typeId = product.typeId;
            newProduct.name = product.name;
            newProduct.description = product.description;
            newProduct.price = product.price;
            newProduct.catagory = product.catagory;
    
            newProduct.requiredProperties = product.requiredPropertyIds.map(id => <any>{id});
            
            await this.save(newProduct);
            return true;
        }
        else
        {
            throw new Error("A property selected cannot be chosen for this product type.");
        }

    }

    async updateProduct(updatedProduct) {
        const values = {};

        if (updatedProduct.name) Object.assign(values, {name: updatedProduct.name})
        if (updatedProduct.catagory) Object.assign(values, {catagory: updatedProduct.catagory})
        if (updatedProduct.description) Object.assign(values, {description: updatedProduct.description})
        if (updatedProduct.price) Object.assign(values, {price: updatedProduct.price})

        await this.createQueryBuilder()
        .update(Product)
        .set(values)
        .where("id = :productId", { productId: updatedProduct.id })
        .execute();
        
        return true;
    }

    async setPublished(id, published) {
        if (published) {
            const result = await this.createQueryBuilder("product")
            .select("COUNT(*) > 0", "hasStock")
            .innerJoin("product.stock", "stock")
            .where("product.id = :id", { id })
            .getRawOne();

            if (result.hasStock == 0) {
                throw new Error("Cannot publish product with no stock!");
            }
        }

        await this.createQueryBuilder()
        .update(Product)
        .set({published})
        .where("id = :id", { id })
        .execute();
    }
}