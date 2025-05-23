import axios from "axios";
import { config } from "../../config/env";

const BASE_URL = config.SHIPROCKET_BASE_URL;

let token: string | null = null;

const getToken = async () => {
  if (token) return token;
  const SHIPROCKET_EMAIL = config.SHIPROCKET_EMAIL;
  const SHIPROCKET_PASSWORD = config.SHIPROCKET_PASSWORD;

  const res = await axios.post(`${BASE_URL}/auth/login`, {
    email: SHIPROCKET_EMAIL,
    password: SHIPROCKET_PASSWORD,
  });

  token = res.data.token;
  return token;
};

const getAuthHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getToken()}`,
});

// Create Order
export const createOrder = async (orderData: any) => {
  try {
    console.log("🚀 Sending order data to Shiprocket API...");
    console.log("Request Data:", JSON.stringify(orderData, null, 2));

    const headers = await getAuthHeaders();
    const res = await axios.post(`${BASE_URL}/orders/create/adhoc`, orderData, {
      headers,
    });

    console.log("✅ Order created successfully!");
    console.log("Response Data:", res.data);

    return res.data;
  } catch (error: any) {
    console.error("❌ Error while creating order:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }
    throw error;
  }
};

// Update Order
export const updateOrder = async (updatedData: any) => {
  const headers = await getAuthHeaders();
  const res = await axios.put(`${BASE_URL}/orders/update/adhoc`, updatedData, {
    headers,
  });
  return res.data;
};

// Get All Orders
export const getAllOrders = async () => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${BASE_URL}/orders`, { headers });
  return res.data;
};

// Get All Shipments
export const getAllShipments = async () => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${BASE_URL}/shipments`, { headers });
  return res.data;
};

// Track by AWB Number
export const trackByAwb = async (awbCode: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${BASE_URL}/courier/track/awb/${awbCode}`, {
    headers,
  });
  return res.data;
};
export const trackByOrder = async (orderId: string) => {
  try {
    const headers = await getAuthHeaders();
    console.log("🚀 Sending tracking request for order ID:", orderId);

    const res = await axios.get(
      `${BASE_URL}/courier/track?order_id=${orderId}`,
      { headers }
    );

    console.log("✅ Tracking response received:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error while tracking order:", error.response?.status);
    console.error("Response Data:", error.response?.data);
    throw error;
  }
};

// Track by Shipment ID
export const trackByShipmentId = async (shipmentId: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.get(
    `${BASE_URL}/courier/track/shipment/${shipmentId}`,
    { headers }
  );
  return res.data;
};
