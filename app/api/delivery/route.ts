// pages/api/deliveries/index.ts
import { connectToDatabase } from "@/lib/db";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import Delivery, { IDelivery } from "@/models/delivery.model";

export async function GET() {
    try {
        await connectToDatabase();
        const deliveries = await Delivery.find({}).lean();

        if (!deliveries || deliveries.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(deliveries);
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        return NextResponse.json(
            { error: "Failed to fetch deliveries" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();
        const body: IDelivery = await request.json();

        if (!body.address || !body.items || body.items.length === 0 || !body.agentId) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const newDelivery = await Delivery.create(body);
        return NextResponse.json(newDelivery);
    } catch (error) {
        console.error("Error creating delivery:", error);
        return NextResponse.json(
            { error: "Failed to create delivery" },
            { status: 500 }
        );
    }
}
