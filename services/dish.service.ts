import { Dish, type IDish } from '../models/dish.model';
import { DishCategory, type IDishCategory } from '../models/dish_category.model';

export class DishService {
    public static readonly createDishCategory = async (
        {
            name,
            picture
        }: {
            name: string;
            picture: string;
        },
    ) : Promise<IDishCategory>=> {
        return await DishCategory.create({
            name,
            picture,
            created_at: new Date(),
            updated_at: new Date(),
        });
    }

    public static readonly getDishCategories = async () : Promise<IDishCategory[]>=> {
        return await DishCategory.find({}).then((dishCategories) => {
            return dishCategories.rows;
        });
    }

    public static readonly getDishCategoryById = async (
        dish_category_id: string,
    ) : Promise<IDishCategory | null>=> {
        return await DishCategory.find({
            id: dish_category_id,
        }).then((dishCategory) => {
            return dishCategory.rows[0] ?? null;
        });
    }

    public static readonly updateDishCategory = async (
        dish_category_id: string,
        {
            name,
            picture
        }: {
            name: string;
            picture: string;
        },
    ) : Promise<void>=> {
        await DishCategory.updateMany({
            id: dish_category_id,
        }, {
            name,
            picture,
            updated_at: new Date(),
        });
    }

    public static readonly deleteDishCategory = async (
        dish_category_id: string,
    ) : Promise<void>=> {
        await DishCategory.removeMany({
            id: dish_category_id,
        });
    }

    public static readonly getDishes = async () : Promise<IDish[]>=> {
        return await Dish.find({}).then((dishes) => {
            return dishes.rows;
        });
    }

    public static readonly getDishById = async (
        dish_id: string,
    ) : Promise<IDish | null>=> {
        return await Dish.find({
            id: dish_id,
        }).then((dish) => {
            return dish.rows[0] ?? null;
        });
    }

    public static readonly createDish = async (
        data: IDish,
    ) : Promise<IDish>=> {
        return await Dish.create(data);
    }

    public static readonly getDishsByCategoryId = async (
        dish_category_id: string,
    ) : Promise<IDish[]>=> {
        return await Dish.find({
            dish_category_id,
        }).then((dishes) => {
            return dishes.rows;
        });
    }

    public static readonly updateDish = async (
        dish_id: string,
        data: IDish,
    ) : Promise<void>=> {
        await Dish.updateMany({
            id: dish_id,
        }, {
            ...data,
            updated_at: new Date(),
        });
    }

    public static readonly deleteDish = async (
        dish_id: string,
    ) : Promise<void>=> {
        await Dish.removeMany({
            id: dish_id,
        });
    }
}