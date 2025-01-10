import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import Order from "@/models/order.model"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"



export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const { productId, variant } = await req.json()
        await connectToDatabase()
        // Create Razorpay order
        const orders = await Order.find({ userId: session.user.id })
            .populate({
                path: "productId",
                select: "productUrl name",
                options: { strictPopulate: false },
            })
            .sort({ createdAt: -1 })
            .lean()

        const validOrders = orders.map((order)=> ({
            ...order,
            productId: order.productId || {
                imageUrl: null,
                name: "Product no longer available",
            },
        }))

        return NextResponse.json(validOrders)
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Faild to fetch order" }, { status: 500 });
    }
}