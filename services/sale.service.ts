import type { IProduct } from "../models/product.model";
import { Sale, type ISale } from "../models/sale.model";
import { ProductService } from "./product.service";

export class SaleService {
    public static readonly createSale = async (
        {
            name,
            image_url,
            description,
            start_date,
            end_date,
            discount_percentage,
            sale_type,
            product_ids,
            category_ids,
            subcategory_ids,
            meta_data,
        }: {
            name: string;
            image_url: string[];
            description: string;
            start_date: Date;
            end_date: Date;
            discount_percentage: number;
            sale_type: 'product' | 'category' | 'subcategory';
            product_ids: string[];
            category_ids: string[];
            subcategory_ids: string[];
            meta_data: Record<string, string>;
        }
    ) : Promise<string>=> {
        const data = await Sale.create({
            name,
            image_url,
            description,
            start_date,
            end_date,
            discount_percentage,
            sale_type,
            product_ids,
            category_ids,
            subcategory_ids,
            meta_data,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return data.id;
    }

    public static readonly updateSale = async (
        sale_id: string,
        {
            name,
            image_url,
            description,
            start_date,
            end_date,
            discount_percentage,
            sale_type,
            product_ids,
            category_ids,
            subcategory_ids,
            meta_data,
        }: {
            name: string;
            image_url: string[];
            description: string;
            start_date: Date;
            end_date: Date;
            discount_percentage: number;
            sale_type: 'product' | 'category' | 'subcategory';
            product_ids: string[];
            category_ids: string[];
            subcategory_ids: string[];
            meta_data: Record<string, string>;
        }
    ) : Promise<void>=> {
        await Sale.updateMany({
            id: sale_id,
        }, {
            name,
            image_url,
            description,
            start_date,
            end_date,
            discount_percentage,
            sale_type,
            product_ids,
            category_ids,
            subcategory_ids,
            meta_data,
            updated_at: new Date(),
        });
    }

    public static readonly deleteSale = async (
        sale_id: string,
    ) : Promise<void>=> {
        await Sale.removeById(sale_id);
    }

    public static readonly getSaleById = async (
        sale_id: string,
    ) : Promise<ISale | null>=> {
        return await Sale
            .find({
                id: sale_id,
            })
            .then((sale) => {
                return sale.rows[0] || null;
            });
    }

    public static readonly getSales = async () : Promise<ISale[]>=> {
        return await Sale
            .find()
            .then((sales) => {
                return sales.rows;
            });
    }

    public static readonly getCurrentSalesOverProduct = async (
        product_id: string,
    ) : Promise<ISale[]>=> {
        return await Sale
            .find({
                product_ids: product_id,
                start_date: { $lte: new Date() },
                end_date: { $gte: new Date() },
            })
            .then((sales) => {
                return sales.rows;
            });
    }

    public static readonly getSaleProducts = async (
        sale_id: string,
        sale_type: string,
        {
            page,
            limit,   
        }: {
            page: number,
            limit: number,
        }
    ) : Promise<IProduct[]>=> {
        const sale = await Sale
            .find({
                id: sale_id,
            })
            .then((sale) => {
                return sale.rows[0];
            });

        if (!sale) {
            return [];
        }

        if(sale_type === 'product') {
            const product_ids = sale.product_ids;
            return await ProductService.getProductsByIds(product_ids);
        }

        else if(sale_type === 'category') {
            const category_ids = sale.category_ids;
            return await ProductService.getProductsByCategory({
                category_id: category_ids,
            }, {
                limit,
                page,
            });
        }

        else if(sale_type === 'subcategory') {
            const subcategory_ids = sale.subcategory_ids;
            return await ProductService.getProductsByCategory({
                subcategory_id: subcategory_ids,
            }, {
                limit,
                page,
            });
        }

        else {
            return [];
        }
    }

    // Get Discounted Price of a product
    public static readonly getDiscountedPrice = async (
        product_id: string,
        price: number,
    ) : Promise<number>=> {
        const sales = await SaleService.getCurrentSalesOverProduct(product_id);

        if (sales.length === 0) {
            return price;
        }

        const discount = sales.reduce((acc, sale) => {
            return Math.max(acc, sale.discount_percentage);
        }, 0);

        return price - (price * discount / 100);
    }
}
