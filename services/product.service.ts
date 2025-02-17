import { Product, type IProduct } from '../models/product.model';

export class ProductService {
    public static readonly getProductsByCategory = async (
        {
            category_id,
            subcategory_id,
        }: {
            category_id?: string;
            subcategory_id?: string;
        },
        {
            limit,
            page
        }: {
            page: number,
            limit: number,
        }
    ) : Promise<IProduct[]>=> {
        let query: Record<string, any> = {};

        if (category_id) {
            query.category_id = category_id;
        }
        if (subcategory_id) {
            query.subcategory_id = subcategory_id;
        }
        
        return await Product.find(query, {
            limit,
            skip: (page - 1) * limit,
        }).then((products) => {
            return products.rows;
        });
    }

    public static readonly getProductById = async (
        product_id: string,
    ) : Promise<IProduct | null>=> {
        return await Product
            .find({
                id: product_id,
            })
            .then((product) => {
                return product.rows[0] || null;
            });
    }

    public static readonly createProduct = async (
        {
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
    }) : Promise<string>=> {
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
    }

    public static readonly updateProduct = async (
        product_id: string,
        data: Record<string, string | number | boolean | string[]>,
    ) : Promise<void>=> {
        await Product.updateMany({
            id: product_id,
        }, {
            ...data,
            updated_at: new Date(),
        });
    }

    public static readonly deleteProduct = async (
        product_id: string,
    ) : Promise<void>=> {
        await Product.removeById(product_id);
    }

    public static readonly searchProduct = async (
        {
            query,
        }: {
            query?: string,
        },
        {
            limit,
            page
        }: {
            page: number,
            limit: number,
        }
    ) : Promise<IProduct[]>=> {
        return await Product.find({
            name: {
                $like: `%${query}%`,
            },
            description: {
                $like: `%${query}%`,
            },
            meta_data: {
                $like: `%${query}%`,
            },
            is_active: true,
        }, {
            limit,
            skip: (page - 1) * limit,
        }).then((products) => {
            return products.rows;
        });
    }

    public static readonly getProductCount = async (
        {
            category_id,
            subcategory_id,
        }: {
            category_id?: string;
            subcategory_id?: string;
        },
    ) : Promise<number>=> {
        let query: Record<string, any> = {};

        if (category_id) {
            query.category_id = category_id;
        }
        if (subcategory_id) {
            query.subcategory_id = subcategory_id;
        }

        return await Product.count(query);
    }

    public static readonly getProductsByIds = async (
        product_ids: string[],
    ) : Promise<IProduct[]>=> {
        return await Product.find({
            id: {
                $in: product_ids,
            },
        }).then((products) => {
            return products.rows;
        });
    }
}
