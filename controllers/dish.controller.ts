import { type Context } from "hono";

import { DishService } from "../services/dish.service";

export class DishController {
  public static readonly getDishes = async (c: Context) => {
    try {
      const dishes = await DishService.getDishes();
      return c.json(dishes);
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };

  public static readonly getDishById = async (c: Context) => {
    try {
      const { dish_id } = c.req.param();
      const dish = await DishService.getDishById(dish_id);
      return c.json(dish);
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };

  public static readonly getDishesByCategoryId = async (c: Context) => {
    try {
      const { dish_category_id } = c.req.param();
      const dishes = await DishService.getDishsByCategoryId(dish_category_id);
      return c.json(dishes);
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };

  public static readonly createDish = async (c: Context) => {
    try {
      const dish = await DishService.createDish(await c.req.json());
      return c.json(dish);
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };

  public static readonly updateDish = async (c: Context) => {
    try {
      const { dish_id } = c.req.param();
      await DishService.updateDish(dish_id, await c.req.json());
      return c.json({
        success: true,
        message: "Dish updated successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };

  public static readonly deleteDish = async (c: Context) => {
    try {
      const { dish_id } = c.req.param();
      await DishService.deleteDish(dish_id);
      return c.json({
        success: true,
        message: "Dish deleted successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };

  public static readonly createDishCategory = async (c: Context) => {
    try {
      const { name, picture, price } = await c.req.json();
      const dishCategory = await DishService.createDishCategory({
        name,
        picture,
      });
      return c.json(dishCategory);
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };

  public static readonly getDishCategories = async (c: Context) => {
    try {
      const dishCategories = await DishService.getDishCategories();
      return c.json(dishCategories);
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };

  public static readonly getDishCategoryById = async (c: Context) => {
    try {
      const { dish_category_id } = c.req.param();
      const dishCategory =
        await DishService.getDishCategoryById(dish_category_id);
      return c.json(dishCategory);
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };

  public static readonly updateDishCategory = async (c: Context) => {
    try {
      const { dish_category_id } = c.req.param();
      const { name, picture } = await c.req.json();
      await DishService.updateDishCategory(dish_category_id, {
        name,
        picture,
      });
      return c.json({
        success: true,
        message: "Dish category updated successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };

  public static readonly deleteDishCategory = async (c: Context) => {
    try {
      const { dish_category_id } = c.req.param();
      await DishService.deleteDishCategory(dish_category_id);
      return c.json({
        success: true,
        message: "Dish category deleted successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        return c.json({ error: err.message }, 400);
      }
    }
  };
}
