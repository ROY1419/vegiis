import { IOrder } from "@/models/order.model";
import { IProduct, VeggisVariant } from "@/models/product.model"
import { Types } from "mongoose"


export type ProductFormData = Omit<IProduct, "_id">;
export interface createOrderData {
    productId: Types.ObjectId | string,
    variant: VeggisVariant,
}

type fetctOption = {
    method?: "GET" | "POST" | "PUT" | "DELETE",
    body?: any
    headers?: Record<string, string>
}


class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: fetctOption = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        };

        const response = await fetch(`/api${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return response.json();
    }
    async getProducts() {
        return this.fetch<IProduct[]>("/products")
    }
    async getProduct(id: string) {
        return this.fetch<IProduct>(`/products/${id}`)
    }
    async createProduct(productData: ProductFormData) {
        return this.fetch<IProduct>("/products", {
            method: "POST",
            body: productData
        });
    };
    async getUserOrder() {
        return this.fetch<IOrder[]>("/orders/user")
    };
    async createOrder(orderData: createOrderData) {
        const sanitizedOrderData = {
            ...orderData,
            productId: orderData.productId.toString(),
        }
        return this.fetch<{ orderId: string, amount: number }>("/orders", {
            method: "POST",
            body: sanitizedOrderData
        });
    };
}

export const apiClient = new ApiClient();