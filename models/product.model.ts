import mongoose, { model, models, Schema } from "mongoose";

export const VEGIIS_VARIANTS = {
    VEG: {
        type: "VEG",
        price: 0,
        dimensions: { weight: Number, height: Number },
        name: String,
        description: String,
        label: "Veg",
    },
    NONVEG: {
        type: "NONVEG",
        price: 0,
        dimensions: { weight: Number, height: Number },
        name: String,
        description: String,
        label: "nonveg",
    },
    SANCKS: {
        type: "SANCKS",
        price: 0,
        dimensions: { weight: Number, height: Number },
        name: String,
        description: String,
        label: "Snacks",
    },
    /* LANDSCAPE: {
        type: "LANDSCAPE",
        dimensions: { width: 1080, height: 1440 },
        label: "Portrait (3:4)",
        aspectRatio: "3:4",
    }
    */
} as const;


export type VegiisVariantsType = keyof typeof VEGIIS_VARIANTS;

export interface VeggisVariant {
    toUpperCase(): "VEG" | "NONVEG" | "SANCKS";
    type: VegiisVariantsType;
    price: number;
    license: "personal" | "commercial";
}
export interface IProduct {
    imageUrl: any;
    length: number;
    map: any;
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    productUrl: string;
    variants: VeggisVariant[];
}

const vegisSchema = new Schema<VeggisVariant>({
    type: { type: String, required: true, enum: ["vegi", "nonvegi", "snacks"] },
    price: { type: Number, required: true, min: 0 },
    license: { type: String, enum: ["vegis", "nonvegis"], required: true },
}, {
    timestamps: true
});

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String, enum: ["vegi", "nonvegi", "snacks"], required: true },
    subcategory: { type: String, enum: ["vegi", "nonvegi", "snacks"], required: true },
    vegis: { type: [vegisSchema], default: [] },
}, { timestamps: true });

const Product = models?.Product || model("Product", productSchema);
export default Product;