import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "@/lib/generateEsewaSignature";

// POST: Payment Initiation
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { method, amount, productName, transactionId } = body;

        if (!method || !amount || !productName) {
            return NextResponse.json(
                { status: "error", message: "Missing required fields" },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        if (method === "esewa") {
            const esewaConfig = {
                amount: amount.toString(),
                failure_url: `${baseUrl}/checkout/payment-options?payment=failed`,
                product_delivery_charge: "0",
                product_service_charge: "0",
                product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE || "EPAYTEST",
                signature: "",
                signed_field_names: "total_amount,transaction_uuid,product_code",
                success_url: `${baseUrl}/checkout/success?payment=esewa`,
                tax_amount: "0",
                total_amount: amount.toString(),
                transaction_uuid: transactionId || uuidv4(),
            };

            const signatureMessage = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
            const secretKey = process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
            esewaConfig.signature = generateEsewaSignature(secretKey, signatureMessage);

            return NextResponse.json({
                status: "success",
                method: "esewa",
                esewaConfig,
                paymentUrl: process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
            });
        }

        if (method === "khalti") {
            const khaltiPayload = {
                return_url: `${baseUrl}/checkout/success?payment=khalti`,
                website_url: baseUrl,
                amount: Number(amount) * 100, // Convert to paisa
                purchase_order_id: transactionId || uuidv4(),
                purchase_order_name: productName,
            };

            const khaltiResponse = await fetch(
                process.env.KHALTI_INITIATE_URL || "https://a.khalti.com/api/v2/epayment/initiate/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                    },
                    body: JSON.stringify(khaltiPayload),
                }
            );

            const khaltiData = await khaltiResponse.json();

            if (!khaltiResponse.ok) {
                console.error("Khalti error:", khaltiData);
                // Return payment URL and public key for client-side handling
                return NextResponse.json({
                    status: "success",
                    method: "khalti",
                    publicKey: process.env.NEXT_PUBLIC_KHALTI_PUBLIC_KEY,
                    payload: khaltiPayload,
                    fallbackMode: true,
                });
            }

            return NextResponse.json({
                status: "success",
                method: "khalti",
                khaltiData,
                publicKey: process.env.NEXT_PUBLIC_KHALTI_PUBLIC_KEY,
                payload: khaltiPayload,
            });
        }

        return NextResponse.json(
            { status: "error", message: "Invalid payment method" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Payment initiation error:", error);
        return NextResponse.json(
            { status: "error", message: "Payment initiation failed" },
            { status: 500 }
        );
    }
}

// GET: Payment Verification
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const method = searchParams.get("method");
        const data = searchParams.get("data");
        const pidx = searchParams.get("pidx");

        if (!method) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/payment-options?error=invalid_method`
            );
        }

        // eSewa Payment Verification
        if (method === "esewa" && data) {
            try {
                const decodedData = JSON.parse(
                    Buffer.from(data, "base64").toString("utf-8")
                );

                const verificationResponse = await fetch(
                    `${process.env.ESEWA_VERIFY_URL}?product_code=${process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const verificationResult = await verificationResponse.json();

                if (
                    verificationResult.status === "COMPLETE" &&
                    verificationResult.transaction_uuid === decodedData.transaction_uuid &&
                    Number(verificationResult.total_amount) === Number(decodedData.total_amount)
                ) {
                    // Payment verified successfully
                    return NextResponse.redirect(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?payment=esewa&verified=true&txn=${decodedData.transaction_uuid}`
                    );
                } else {
                    return NextResponse.redirect(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/payment-options?error=verification_failed`
                    );
                }
            } catch (error) {
                console.error("eSewa verification error:", error);
                return NextResponse.redirect(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/payment-options?error=verification_error`
                );
            }
        }

        // Khalti Payment Verification
        if (method === "khalti" && pidx) {
            try {
                const verificationResponse = await fetch(
                    process.env.KHALTI_VERIFY_URL || "https://a.khalti.com/api/v2/epayment/lookup/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                        },
                        body: JSON.stringify({ pidx }),
                    }
                );

                const verificationResult = await verificationResponse.json();

                if (
                    verificationResult.status === "Completed" &&
                    verificationResult.pidx === pidx
                ) {
                    // Payment verified successfully
                    return NextResponse.redirect(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?payment=khalti&verified=true&pidx=${pidx}`
                    );
                } else {
                    return NextResponse.redirect(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/payment-options?error=verification_failed`
                    );
                }
            } catch (error) {
                console.error("Khalti verification error:", error);
                return NextResponse.redirect(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/payment-options?error=verification_error`
                );
            }
        }

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/payment-options?error=invalid_request`
        );
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/payment-options?error=server_error`
        );
    }
}
