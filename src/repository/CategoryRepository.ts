import { EntityRepository, TreeRepository } from "typeorm";
import { Category } from "@entity/Category";
import { ProductType } from "@entity/ProductType";

@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category> {

    async insertSubCategory(parentId: number, name: string) {
        //Valdiation: Check parent category has no products assigned.
        const { numProducts } = await this.createQueryBuilder("category")
        .select("COUNT(*)", "numProducts")
        .innerJoin("category.products", "products")
        .where("category.id = :parentId", { parentId })
        .getRawOne();
        console.log(numProducts);

        if ( numProducts > 0) throw new Error("Cannot add a sub-category to a category with products assigned!");

        const newCategory = new Category();
        newCategory.parent = <any>{id: parentId};
        newCategory.name = name;
        await this.save(newCategory);
        return true;
    }

    async insertCategory(productTypeId: number, name: string) {
        const { rootCategoryId } = await this.createQueryBuilder()
        .select("productType.rootCategoryId", "rootCategoryId")
        .from(ProductType, "productType")
        .where("productType.id =:productTypeId", { productTypeId })
        .getRawOne();
        await this.insertSubCategory(rootCategoryId, name);
        return true;
    }

    async getSubCategories(parentId: number) {
        const parent = new Category();
        parent.id = parentId;
        const result = await this.createDescendantsQueryBuilder("category", "categoryClosure", parent)
        .getMany();
        return result;
    }

    async getLeafCategories(parentId: number) {
        const parent = new Category();
        parent.id = parentId;
        return this.createDescendantsQueryBuilder("category", "categoryClosure", parent)
        .where(qb => {
            const subQuery = qb.subQuery()
            .select("DISTINCT cat.parentid")
            .from(Category, "cat")
            .where("cat.parentId IS NOT NULL")
            .getQuery();
            return "category.id NOT IN " + subQuery;
        })
        .getMany();
    }
}