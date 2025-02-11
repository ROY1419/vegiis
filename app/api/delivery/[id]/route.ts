// pages/api/deliveries/[id].ts
import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import Delivery from "@/models/delivery.model";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const delivery = await Delivery.findById(params.id).lean();

        if (!delivery) {
            return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
        }

        return NextResponse.json(delivery);
    } catch (error) {
        console.error("Error fetching delivery:", error);
        return NextResponse.json(
            { error: "Failed to fetch delivery" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();
        const body = await req.json();
        const updatedDelivery = await Delivery.findByIdAndUpdate(params.id, body, {
            new: true,
        });

        if (!updatedDelivery) {
            return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
        }

        return NextResponse.json(updatedDelivery);
    } catch (error) {
        console.error("Error updating delivery:", error);
        return NextResponse.json(
            { error: "Failed to update delivery" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();
        const deletedDelivery = await Delivery.findByIdAndDelete(params.id);

        if (!deletedDelivery) {
            return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Delivery deleted successfully" });
    } catch (error) {
        console.error("Error deleting delivery:", error);
        return NextResponse.json(
            { error: "Failed to delete delivery" },
            { status: 500 }
        );
    }
}
