import { SubCategory, type ISubCategory } from '../models/subcategory.model';

export class SubCategoryService {
    public static readonly getSubCategories = async () : Promise<ISubCategory[]>=> {
        return await SubCategory.find({}).then((subcategories) => {
            return subcategories.rows;
        });
    }

    public static readonly getSubCategoryById = async (
        subcategory_id: string,
    ) : Promise<ISubCategory | null>=> {
        return await SubCategory
            .find({
                id: subcategory_id,
            })
            .then((subcategory) => {
                return subcategory.rows[0] || null;
            });
    }

    public static readonly createSubCategory = async (
        {
            name,
            category_id,
        }: {
            name: string,
            category_id: string,
        }
    ) : Promise<string>=> {
        const data = await SubCategory.create({
            name,
            category_id,
            created_at: new Date(),
            updated_at: new Date(),
        });
        
        return data.id;
    }

    public static readonly updateSubCategory = async (
        subcategory_id: string,
        {
            name,
            category_id,
        }: {
            name: string,
            category_id: string,
        }
    ) : Promise<void>=> {
        await SubCategory.updateMany({
            id: subcategory_id,
        }, {
            name,
            category_id,
            updated_at: new Date(),
        });
    }

    public static readonly deleteSubCategory = async (
        subcategory_id: string,
    ) : Promise<void>=> {
        await SubCategory.removeMany({
            id: subcategory_id,
        });
    }

    public static readonly getSubCategoriesByCategory = async (
        category_id: string,
    ) : Promise<ISubCategory[]>=> {
        return await SubCategory.find({
            category_id,
        }).then((subcategories) => {
            return subcategories.rows;
        });
    }
}