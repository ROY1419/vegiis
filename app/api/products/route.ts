import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Product, IProduct } from "@/models/product.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();
        const products = await Product.find({}).lean()
        if (!products || products.length === 0) {
            return NextResponse.json({ error: "No product found" }, { status: 404 })
        }
        return NextResponse.json({ products }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "something went wrong" },
            { status: 404 }
        )

    }
}

export async function POST(request: NextResponse) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 404 })
        }
        await connectToDatabase()
        const body: IProduct = await request.json();

        if (
            !body.name ||
            !body.description ||
            !body.productUrl ||
            body.variants.length === 0
        ) {
            return NextResponse.json({ error: "All fields are required" }, { status: 404 })
        }
        // Validate variants
        for(const variants of body.variants){
            if(!variants.price || !variants.license || !variants.type){
                return NextResponse.json({ error: "All fields are required" }, { status: 404 })
            }
        }
        const newProduct = await Product.create(body);
        return NextResponse.json({ newProduct }, { status: 201 })

    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 404 }
        )
    }

}