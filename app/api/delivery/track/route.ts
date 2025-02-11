// pages/api/delivery/track.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import Delivery from "@/models/delivery.model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { orderId } = req.query;

    if (!orderId || typeof orderId !== "string") {
        return res.status(400).json({ error: "Invalid or missing orderId" });
    }

    try {
        await connectToDatabase();

        const delivery = await Delivery.findOne({ orderId }).lean();
        if (!delivery || !delivery.location) {
            return res.status(404).json({ error: "Delivery not found or location unavailable" });
        }

        return res.status(200).json(delivery.location);
    } catch (error) {
        console.error("Error fetching delivery location:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
