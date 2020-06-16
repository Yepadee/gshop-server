import { EntityRepository, Repository } from "typeorm";
import { Category } from "@entity/Category";
import { getConnection } from "typeorm";
import { ProductType } from "@entity/ProductType";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

    async insertCategory(parentCategoryId, name) {
        const newCategory = new Category();
        newCategory.parent = <any>{id: parentCategoryId};
        newCategory.name = name;
        await this.save(newCategory);
    }

    async insertRootCategory(productTypeId, name) {
        console.log(productTypeId);
        console.log(name);
        const result = await getConnection().createQueryBuilder()
        .select("productType.rootCategoryId", "rootCategoryId")
        .from(ProductType, "productType")
        .where("productType.id =:productTypeId", { productTypeId })
        .getRawOne();
        console.log(result);
        this.insertCategory(1, name);
    }
}