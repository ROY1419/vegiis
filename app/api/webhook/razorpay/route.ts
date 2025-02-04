import { NextRequest, NextResponse } from "next/server";
import crypto  from "crypto";
import { connectToDatabase } from "@/lib/db";
import Order  from "@/models/order.model";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get("y-razorpay-signature");
        const expectedSignature = crypto.createHmac("shah256", process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(body)
            .digest("hex");
        
        if( expectedSignature !== signature){
            return NextResponse.json({error: "Invalid signature"}, {status: 400})
        }

        const event = JSON.parse(body)
        await connectToDatabase()
        if(event.event === "payment.captured"){
            const payment = event.payload.payment.emtityl;
            const order = await Order.findOneAndUpdate({
                razorpayOrderId: payment.id,
                status: "Completed",
            }
            ).populate([
                {
                    path: "productId",
                    select: "productUrl name",
                },
                {
                    path: "userID",
                    select: "email",
                }
            ])
            if(order){
                const transporter = nodemailer.createTransport({
                    service: "sandbox.smg.mailtrap.iio",
                    port: 587,
                    auth: {
                        user: process.env.MAILTRAP_USER,
                        pass: process.env.MAILTRAP_PASS,
                    },
                });
                await transporter.sendMail({
                from: "vegiis",
                to: order.userID.email,
                subject: "Order Confirmed",
                text: `Hello ${order.productId.email}, your order has been confirmed. Please find the details below:`,
            })
            }
            
        }
        return NextResponse.json({message: "success"}, {status: 200})
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 404 }
        )
    }
}