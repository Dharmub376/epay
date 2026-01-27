import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and OTP are required" },
                { status: 400 }
            );
        }

        // Find valid OTP
        const otpRecord = await prisma.verificationToken.findFirst({
            where: {
                email,
                code: otp,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!otpRecord) {
            return NextResponse.json(
                { error: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // Update user as verified
        const user = await prisma.user.update({
            where: { email },
            data: { isVerified: true },
        });

        // Delete used OTP
        await prisma.verificationToken.delete({
            where: { id: otpRecord.id },
        });

        return NextResponse.json(
            {
                message: "Email verified successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("OTP verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
