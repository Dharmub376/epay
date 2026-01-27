import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, name, phone, password } = await req.json();

        // Validation
        if (!email || !name || !phone || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                phone,
                password: hashedPassword,
            },
        });

        // Generate and send OTP
        const otp = Math.random().toString().slice(2, 8);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.verificationToken.create({
            data: {
                email,
                code: otp,
                expiresAt,
                userId: user.id,
            },
        });

        const emailSent = await sendOtpEmail(email, otp);

        if (!emailSent) {
            return NextResponse.json(
                { error: "Failed to send OTP. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: "Account created. OTP sent to your email.",
                userId: user.id,
                email: user.email,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
