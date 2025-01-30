import mongoose, { model, models, Schema } from "mongoose";

export interface IDelivery {
    address: string;
    items: Array<{ name: string; quantity: number }>;
    status: "pending" | "in-progress" | "delivered";
    agentId: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const deliverySchema = new Schema<IDelivery>(
    {
        address: { type: String, required: true },
        items: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
            },
        ],
        status: { type: String, enum: ["pending", "in-progress", "delivered"], default: "pending" },
        agentId: {  ref: "DeliveryAgent", required: true },
    },
    {
        timestamps: true,
    }
);

const Delivery = models?.Delivery || model<IDelivery>("Delivery", deliverySchema);
export default Delivery
