"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PaymentOption {
    id: string;
    name: string;
    description: string;
    image?: string;
    emoji?: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
    {
        id: "visa",
        name: "Credit / Debit Card",
        description: "Visa, Mastercard, American Express",
        emoji: "💳",
    },
    {
        id: "khalti",
        name: "Khalti",
        description: "Digital wallet payment",
        image: "/khalti.png",
    },
    {
        id: "esewa",
        name: "eSewa",
        description: "Digital wallet payment",
        image: "/esewa.png",
    },
];

interface User {
    name: string;
    email: string;
}

interface DeliveryDetails {
    fullName: string;
    phone: string;
    address: string;
}

export default function PaymentOptionsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const deliveryStr = localStorage.getItem("deliveryDetails");

        if (!userStr || !deliveryStr) {
            router.push("/checkout");
            return;
        }

        try {
            const parsedUser = JSON.parse(userStr) as User;
            const parsedDelivery = JSON.parse(deliveryStr) as DeliveryDetails;
            setUser(parsedUser);
            setDeliveryDetails(parsedDelivery);
        } catch {
            router.push("/checkout");
        }
    }, [router]);

    const initiateKhaltiPayment = () => {
        interface KhaltiPayload {
            token: string;
            amount: number;
        }

        const config = {
            publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a507256", // Replace with your Khalti public key
            productIdentity: "harpic-500ml",
            productName: "Harpic",
            productUrl: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
            paymentPreference: ["KHALTI"],
            eventHandler: {
                onSuccess(payload: KhaltiPayload) {
                    console.log("Khalti payment success:", payload);
                    // Verify payment on backend
                    fetch("/api/auth/payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            paymentMethod: "khalti",
                            token: payload.token,
                            amount: payload.amount,
                        }),
                    }).then(() => {
                        router.push("/checkout/success");
                    }).catch(() => {
                        setError("Failed to verify payment");
                        setLoading(false);
                    });
                },
                onError(error: Error) {
                    console.error("Khalti payment error:", error);
                    setError("Payment failed. Please try again.");
                    setLoading(false);
                },
                onClose() {
                    console.log("Khalti widget closed");
                    setLoading(false);
                },
            },
        };

        // @ts-expect-error - Khalti SDK loaded via script
        const checkout = new window.KhaltiCheckout(config);
        checkout.show({ amount: 12000 }); // Amount in paisa (120 NPR = 12000 paisa)
    };

    const initiateEsewaPayment = () => {
        try {
            const path = "https://uat.esewa.com.np/epay/main";
            const params = {
                amt: "120",
                psc: "0",
                pdc: "0",
                txAmt: "0",
                tAmt: "120",
                pid: `HARPIC-${Date.now()}`,
                scd: "EPAYTEST", // Replace with your eSewa merchant code
                su: `${window.location.origin}/checkout/success`,
                fu: `${window.location.origin}/checkout/payment-options`,
            };

            const form = document.createElement("form");
            form.setAttribute("method", "POST");
            form.setAttribute("action", path);

            Object.entries(params).forEach(([key, value]) => {
                const hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", value);
                form.appendChild(hiddenField);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error("eSewa payment error:", error);
            setError("Failed to initiate eSewa payment. Please try again.");
            setLoading(false);
        }
    };

    const handleProceedToPayment = () => {
        if (!selectedPayment) {
            setError("Please select a payment method");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (selectedPayment === "visa") {
                router.push("/checkout/payment");
            } else if (selectedPayment === "khalti") {
                initiateKhaltiPayment();
            } else if (selectedPayment === "esewa") {
                initiateEsewaPayment();
            }
        } catch (error) {
            console.error("Payment processing error:", error);
            setError("Failed to process payment");
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load Khalti SDK
        if (typeof window !== "undefined" && !document.getElementById("khalti-sdk")) {
            const script = document.createElement("script");
            script.id = "khalti-sdk";
            script.src = "https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js";
            document.body.appendChild(script);
        }
    }, []);

    if (!user || !deliveryDetails) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-rose-50 via-white to-amber-50 px-4 py-10">
            <Card className="w-full max-w-lg overflow-hidden border-red-200 bg-white/95 shadow-2xl shadow-red-100 backdrop-blur-sm">
                {/* Header */}
                <div className="border-b border-red-100 bg-linear-to-r from-red-50 to-white px-6 py-4">
                    <h1 className="text-lg font-semibold text-red-700">Select Payment Method</h1>
                    <p className="text-xs text-zinc-600 mt-1">Choose how you would like to pay for your order</p>
                </div>

                {/* Product Summary */}
                <CardHeader className="flex flex-row items-center gap-4 border-b border-red-100 bg-red-50/40 px-6 py-4">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-red-100 bg-white">
                        <Image
                            src="/product.png"
                            alt="Harpic"
                            width={100}
                            height={100}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-base text-red-700">Harpic</CardTitle>
                        <p className="text-sm text-zinc-600">500 ml bottle</p>
                    </div>
                    <p className="text-lg font-bold text-red-700">NPR 120</p>
                </CardHeader>

                {/* Payment Options */}
                <CardContent className="space-y-4 px-6 py-6">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-zinc-700">Payment Method</Label>
                        <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                            {PAYMENT_OPTIONS.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => setSelectedPayment(option.id)}
                                    className={cn(
                                        "flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all hover:border-red-300 hover:bg-red-50/50",
                                        selectedPayment === option.id
                                            ? "border-red-500 bg-red-50"
                                            : "border-zinc-200 bg-white"
                                    )}
                                >
                                    <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            {option.image ? (
                                                <div className="relative h-8 w-12 shrink-0">
                                                    <Image
                                                        src={option.image}
                                                        alt={option.name}
                                                        width={48}
                                                        height={32}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-2xl">{option.emoji}</span>
                                            )}
                                            <Label
                                                htmlFor={option.id}
                                                className="cursor-pointer font-semibold text-zinc-900"
                                            >
                                                {option.name}
                                            </Label>
                                        </div>
                                        <p className="mt-1 text-xs text-zinc-600">{option.description}</p>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
                        🔒 Your payment information is secure and encrypted. We never store your card details.
                    </div>

                    <button
                        onClick={handleProceedToPayment}
                        disabled={loading || !selectedPayment}
                        className="w-full rounded-lg border-2 border-red-600 bg-red-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md hover:shadow-red-200 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {loading ? "Processing..." : "Proceed to Payment"}
                    </button>
                </CardContent>

                {/* Actions */}
                <CardFooter className="border-t border-red-100 bg-white/50 px-6 py-4">
                    <Link href="/checkout/delivery" className="w-full">
                        <button className="w-full rounded-lg border-2 border-zinc-300 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-wide text-zinc-700 transition hover:border-zinc-400 hover:shadow-sm active:scale-95">
                            Back to Delivery
                        </button>
                    </Link>
                </CardFooter>
            </Card>
        </main>
    );
}
