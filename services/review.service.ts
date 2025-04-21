import { Review, type IReview } from "../models/review.model";

export class ReviewService {
    public static readonly getReviewsByProduct = async (
        product_id: string,
    ) : Promise<IReview[]>=> {
        return await Review.find({
            product_id,
        }).then((reviews) => {
            return reviews.rows;
        });
    }

    public static readonly getReviewsByDish = async (
        dish_id: string,
    ) : Promise<IReview[]>=> {
        return await Review.find({
            dish_id,
        }).then((reviews) => {
            return reviews.rows;
        });
    }

    public static readonly getReviewById = async (
        review_id: string,
    ) : Promise<IReview | null>=> {
        return await Review
            .find({
                id: review_id,
            })
            .then((review) => {
                return review.rows[0] ?? null;
            });
    }

    public static readonly createReview = async (
        {
            user_id,
            product_id,
            rating,
            comment,
        }: {
            user_id: string;
            product_id: string;
            rating: number;
            comment: string;
        }
    ) : Promise<string>=> {
        const data = await Review.create({
            user_id,
            product_id,
            rating,
            comment,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return data.id;
    }

    public static readonly updateReview = async (
        review_id: string,
        {
            user_id,
            product_id,
            rating,
            comment,
        }: {
            user_id: string;
            product_id: string;
            rating: number;
            comment: string;
        }
    ) : Promise<void>=> {
        await Review.updateMany({
            id: review_id,
        }, {
            user_id,
            product_id,
            rating,
            comment,
            updated_at: new Date(),
        });
    }

    public static readonly deleteReview = async (
        review_id: string,
    ) : Promise<void>=> {
        await Review.removeMany({
            id: review_id,
        });
    }

    public static readonly getAverageRatingForProduct = async (
        product_id: string,
    ) : Promise<number>=> {
        const reviews = await this.getReviewsByProduct(product_id);
        if (reviews.length === 0) {
            return 0;
        }
        const totalRating = reviews.reduce((acc, review) => {
            return acc + review.rating;
        }, 0);

        return totalRating / reviews.length;
    }

    public static readonly getAverageRatingForDish = async (
        dish_id: string,
    ) : Promise<number>=> {
        const reviews = await this.getReviewsByDish(dish_id);
        if (reviews.length === 0) {
            return 0;
        }
        const totalRating = reviews.reduce((acc, review) => {
            return acc + review.rating;
        }, 0);

        return totalRating / reviews.length;
    }
}
