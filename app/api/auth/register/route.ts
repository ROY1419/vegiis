import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()
        if (!email || !password) {
            return NextResponse.json(
                { email: "Email and password are required" },
                { status: 400 }
            );
        };
        await connectToDatabase()
        const existingUser = User.findOne({ email })
        if (!existingUser) {
            return NextResponse.json(
                { email: "Email already exists" },
                { status: 400 }
            );
        };
        await User.create({
            email,
            password,
            role: "user"
        });
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            status: 201,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({
            message: "Registration failed",
            success: false,
            status: 500
        })
    }
}