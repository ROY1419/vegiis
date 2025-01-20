import mongoose, { Schema } from "mongoose";

export const VEGIIS_VARIANTS = {
    VEG: {
        type: "VEG",
        price: 0,
        name: String,
        description: String
    },
    NONVEG: {
        type: "NONVEG",
        price: 0,
        name: String,
        description: String
    },
    SANCKS: {
        type: "SANCKS",
        price: 0,
        name: String,
        description: String
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

export interface VeggisVariant{
    toUpperCase(): "VEG" | "NONVEG" | "SANCKS";
    type: VegiisVariantsType;
    price: number;
    license: "personal" | "commercial";
}
export interface IProduct {
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
    image: { type: String, required: true },
    category: { type: String, enum: ["vegi", "nonvegi", "snacks"], required: true },
    subcategory: { type: String, enum: ["vegi", "nonvegi", "snacks"], required: true },
    vegis: { type: [vegisSchema], default: [] },
}, { timestamps: true });


export const Product = mongoose.model("Product", productSchema);