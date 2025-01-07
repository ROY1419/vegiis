import mongoose, { models, Schema } from "mongoose";
import { VeggisVariant, VegiisVariantsType } from "./product.model";

// Interfaces for populated fields
interface PopulatedUser {
    _id: mongoose.Types.ObjectId;
    email: string;
}

interface PopulatedProduct {
    _id: mongoose.Types.ObjectId;
    name: string;
    productUrl: string;
}

// Main Order Interface
export interface IOrder {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | PopulatedUser;
    productId: mongoose.Types.ObjectId | PopulatedProduct;
    variant: {
        type: VeggisVariant;
        price: number;
        licence: "personal" | "commercial";
    };
    razorpayOrderId: string;
    razorpayPaymentId?: string; // Make optional if not always present
    amount: number;
    status: "pending" | "completed" | "failed";
    paymentMethod: "razorpay" | "cod" | "UPI";
    createdAt?: Date;
    updatedAt?: Date;
}

// Updated Schema with stricter typings
const orderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        variant: {
            type: {
                type: String,
                required: true,
                enum: ["VEGI", "NON-VEGI", "SNACKS"] as unknown as VegiisVariantsType[],
                set: (v: string) => v.toUpperCase(),
            },
            price: { type: Number, required: true },
            licence: {
                type: String,
                required: true,
                enum: ["personal", "commercial"],
            },
        },
        razorpayOrderId: { type: String, required: true },
        razorpayPaymentId: { type: String }, // Made optional
        amount: { type: Number, required: true },
        status: {
            type: String,
            required: true,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["razorpay", "cod", "UPI"],
        },
    },
    { timestamps: true }
);

// Model Initialization
const Order = models?.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;