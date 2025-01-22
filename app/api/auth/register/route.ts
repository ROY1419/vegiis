import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Parse and validate the request body
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectToDatabase();

        // Check if the user already exists
        const existingUser = await User.findOne({ email }); // Fix typo
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }

        // Create a new user
        await User.create({
            email,
            password, // Ideally, hash the password before storing
            role: "user",
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                success: true,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);

        return NextResponse.json(
            {
                error: "Registration failed",
                success: false,
            },
            { status: 500 }
        );
    }
}
