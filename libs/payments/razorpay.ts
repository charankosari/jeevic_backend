import Razorpay from 'razorpay';
import { normalizeAmount } from '../../helpers/amount';
import { config } from '../../config/env';

const razorpayInstance = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET,
});

const createOrder = async ({
    order_id,
    amount,
    shipping_fee,
}: {
    order_id: string;
    amount: number;
    shipping_fee: number;
}) => {
    const order = await razorpayInstance.orders.create({
        amount: normalizeAmount(
            amount,
        ),
        currency: 'INR',
        receipt: 'ORDER #' + Date.now(),
        shipping_fee: normalizeAmount(
            shipping_fee,
        ),
        notes: {
            platform_order_id: order_id,
        }
    });

    return order;
}

const capturePayment = async ({
    payment_id,
    amount,
}: {
    order_id: string;
    payment_id: string;
    amount: number;
}) => {
    const payment = await razorpayInstance.payments.capture(
        payment_id,
        amount,
        'INR',
    );

    return payment;
}

const orderStatus = async ({
    order_id,
}: {
    order_id: string;
}) => {
    const order = await razorpayInstance.orders.fetch(order_id);

    return order;
}

export { createOrder, capturePayment, orderStatus };