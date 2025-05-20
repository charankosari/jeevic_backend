import { Category, type ICategory } from "../models/category.model";

export class CategoryService {
  public static readonly getCategories = async (): Promise<ICategory[]> => {
    return await Category.find({}).then((categories) => {
      return categories.rows;
    });
  };

  public static readonly getCategory = async (
    category_id: string
  ): Promise<ICategory | null> => {
    return await Category.find({
      id: category_id,
    }).then((category) => {
      return category.rows[0] || null;
    });
  };

  public static readonly createCategory = async ({
    name,
    image_url,
  }: {
    name: string;
    image_url: string[];
  }): Promise<string> => {
    const data = await Category.create({
      name,
      image_url,
      created_at: new Date(),
      updated_at: new Date(),
    });
    console.log(data, image_url);
    return data.id;
  };

  public static readonly updateCategory = async (
    category_id: string,
    {
      name,
      image_url,
    }: {
      name: string;
      image_url: string[];
    }
  ): Promise<void> => {
    await Category.updateMany(
      {
        id: category_id,
      },
      {
        name,
        image_url,
        updated_at: new Date(),
      }
    );
  };

  public static readonly deleteCategory = async (
    category_id: string
  ): Promise<void> => {
    await Category.removeMany({
      id: category_id,
    });
  };
}
