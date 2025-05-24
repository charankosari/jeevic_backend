import { Product, type IProduct } from "../models/product.model";
import { User } from "../models/user.model";
import { Wishlist, type IWishlist } from "../models/wishlist.model";
import { Cart, type ICart } from "../models/cart.model";

export class ProductService {
  public static readonly getProductsByCategory = async (
    {
      category_id,
      subcategory_id,
      is_active,
    }: {
      category_id?: string;
      subcategory_id?: string;
      is_active?: boolean;
    },
    {
      limit,
      page,
    }: {
      page: number;
      limit: number;
    }
  ): Promise<IProduct[]> => {
    let query: Record<string, any> = {};

    if (category_id) {
      query.category_id = category_id;
    }
    if (subcategory_id) {
      query.subcategory_id = subcategory_id;
    }
    if (is_active) {
      query.is_active = is_active;
    }

    return await Product.find(query, {
      limit,
      skip: (page - 1) * limit,
    }).then((products) => {
      return products.rows;
    });
  };

  public static readonly getProductById = async (
    product_id: string
  ): Promise<IProduct | null> => {
    return await Product.find({
      id: product_id,
      is_active: true,
    }).then((product) => {
      return product.rows[0] || null;
    });
  };

  public static readonly createProduct = async ({
    name,
    description,
    price,
    image_url,
    category_id,
    subcategory_id,
    meta_data,
    is_active,
    availability_count,
  }: {
    name: string;
    description: string;
    price: number;
    image_url: string[];
    category_id: string;
    subcategory_id: string;
    meta_data: Record<string, string>;
    is_active: boolean;
    availability_count: number;
  }): Promise<string> => {
    const data = await Product.create({
      name,
      description,
      price,
      image_url,
      category_id,
      subcategory_id,
      meta_data,
      is_active,
      availability_count,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return data.id;
  };

  public static readonly updateProduct = async (
    product_id: string,
    data: Record<string, string | number | boolean | string[]>
  ): Promise<void> => {
    await Product.updateMany(
      {
        id: product_id,
      },
      {
        ...data,
        updated_at: new Date(),
      }
    );
  };

  public static readonly deleteProduct = async (
    product_id: string
  ): Promise<void> => {
    await Product.removeById(product_id);
  };

  public static readonly searchProduct = async (
    {
      query,
    }: {
      query: string;
    },
    {
      limit,
      page,
    }: {
      page: number;
      limit: number;
    }
  ): Promise<IProduct[]> => {
    const result = await Product.find({ is_active: true });
    const allProducts = Array.isArray(result) ? result : result.rows || [];

    const lowerQuery = query.toLowerCase();

    const filteredProducts = allProducts.filter((product: IProduct) => {
      const nameMatch = product.name?.toLowerCase().includes(lowerQuery);
      const descMatch = product.description?.toLowerCase().includes(lowerQuery);
      const metaDataMatch = Object.values(product.meta_data || {}).some((val) =>
        val.toLowerCase().includes(lowerQuery)
      );

      return nameMatch || descMatch || metaDataMatch;
    });

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;

    return filteredProducts.slice(start, end);
  };

  public static readonly getProductCount = async ({
    category_id,
    subcategory_id,
  }: {
    category_id?: string;
    subcategory_id?: string;
  }): Promise<number> => {
    let query: Record<string, any> = {};

    if (category_id) {
      query.category_id = category_id;
    }
    if (subcategory_id) {
      query.subcategory_id = subcategory_id;
    }

    return await Product.count(query);
  };

  public static readonly getProductsByIds = async (
    product_ids: string[]
  ): Promise<IProduct[]> => {
    return await Product.find({
      id: { $in: product_ids },
      is_active: true,
    }).then((products) => {
      return products.rows;
    });
  };

  public static readonly getLatestProducts = async () => {
    return await Product.find(
      { is_active: true },
      { sort: { created_at: "DESC" }, limit: 10 }
    ).then((products) => {
      return products.rows;
    });
  };
  private static readonly safeFind = async <T>(
    model: any,
    query: object
  ): Promise<T[]> => {
    const result = await model.find(query);
    return Array.isArray(result) ? result : result.rows || [];
  };
  public static readonly getUserRecommendedProducts = async (
    user_id: string
  ): Promise<IProduct[]> => {
    const user = await User.findById(user_id);
    if (!user) {
      throw new Error("User not found");
    }

    // Fetch wishlist and cart items
    const wishlistItems = await this.safeFind<IWishlist>(Wishlist, { user_id });
    const cartItems = await this.safeFind<ICart>(Cart, { user_id });

    // Extract product IDs
    const wishlistProductIds = wishlistItems.map((item) => item.product_id);
    const cartProductIds = cartItems.map((item) => item.product_id);
    const allProductIds = [
      ...new Set([...wishlistProductIds, ...cartProductIds]),
    ];

    // Fetch products from wishlist and cart
    const products = await this.safeFind<IProduct>(Product, {
      id: { $in: allProductIds },
      is_active: true,
    });

    // Extract category and subcategory IDs
    const categoryIds = [...new Set(products.map((p) => p.category_id))];
    const subcategoryIds = [...new Set(products.map((p) => p.subcategory_id))];

    // Fetch additional products by category and subcategory
    const additionalProducts = await this.safeFind<IProduct>(Product, {
      $or: [
        { category_id: { $in: categoryIds } },
        { subcategory_id: { $in: subcategoryIds } },
      ],
      is_active: true,
    });

    // Now fetch products based on user's recent search history
    let searchHistoryQueries: string[] = [];
    try {
      searchHistoryQueries = JSON.parse(user.meta_data.searchhistory || "[]")
        .filter((q: string | null) => typeof q === "string" && q.trim() !== "")
        .slice(-5); // latest 5 searches
    } catch (err) {
      console.warn("Failed to parse search history:", err);
    }

    const searchProducts: IProduct[] = [];

    for (const query of searchHistoryQueries) {
      const queryLower = query.toLowerCase();

      const foundProducts = (
        await this.safeFind<IProduct>(Product, { is_active: true })
      ).filter(
        (product: IProduct) =>
          product.name?.toLowerCase().includes(queryLower) ||
          product.description?.toLowerCase().includes(queryLower) ||
          Object.values(product.meta_data || {}).some((val) =>
            val.toLowerCase().includes(queryLower)
          )
      );

      searchProducts.push(...foundProducts);
    }

    // Combine all product sets and remove duplicates
    const allProducts = [...products, ...additionalProducts, ...searchProducts];
    const uniqueProducts: IProduct[] = Array.from(
      new Set(allProducts.map((p) => p.id))
    )
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is IProduct => p !== undefined);

    return uniqueProducts;
  };
}
