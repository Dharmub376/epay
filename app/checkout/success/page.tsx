"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const paymentMethod = searchParams.get("payment");
        const isVerified = searchParams.get("verified");
        const pidx = searchParams.get("pidx");
        const data = searchParams.get("data");

        // If coming from eSewa with data parameter, verify payment
        if (paymentMethod === "esewa" && data && !isVerified) {
            // Call verification API
            fetch(`/api/checkout-session?method=esewa&data=${data}`)
                .then(() => {
                    setVerified(true);
                    setVerifying(false);
                })
                .catch(() => {
                    setError("Payment verification failed");
                    setVerifying(false);
                });
        } else if (paymentMethod === "khalti" && pidx && !isVerified) {
            // Call verification API for Khalti
            fetch(`/api/checkout-session?method=khalti&pidx=${pidx}`)
                .then(() => {
                    setVerified(true);
                    setVerifying(false);
                })
                .catch(() => {
                    setError("Payment verification failed");
                    setVerifying(false);
                });
        } else if (isVerified === "true") {
            // Already verified - just stop verifying
            setVerifying(false);
            setVerified(true);
        } else {
            setVerifying(false);
        }
    }, [searchParams]);

    if (verifying) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-rose-50 via-white to-amber-50 px-4 py-10">
                <Card className="w-full max-w-lg border-red-200 bg-white/95 shadow-2xl shadow-red-100">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-600"></div>
                        <h2 className="text-xl font-semibold text-zinc-900">Verifying Payment...</h2>
                        <p className="mt-2 text-sm text-zinc-600">Please wait while we confirm your payment</p>
                    </CardContent>
                </Card>
            </main>
        );
    }

    if (error || !verified) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-rose-50 via-white to-amber-50 px-4 py-10">
                <Card className="w-full max-w-lg border-red-200 bg-white/95 shadow-2xl shadow-red-100">
                    <CardHeader>
                        <CardTitle className="text-center text-red-600">Payment Failed</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <span className="text-4xl">❌</span>
                        </div>
                        <h2 className="text-xl font-semibold text-zinc-900">Payment Verification Failed</h2>
                        <p className="mt-2 text-center text-sm text-zinc-600">
                            {error || "We couldn't verify your payment. Please contact support."}
                        </p>
                        <div className="mt-6 flex gap-3">
                            <Link href="/checkout/payment-options">
                                <button className="rounded-lg border-2 border-red-600 bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
                                    Try Again
                                </button>
                            </Link>
                            <Link href="/">
                                <button className="rounded-lg border-2 border-zinc-300 bg-white px-6 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400">
                                    Go Home
                                </button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-rose-50 via-white to-amber-50 px-4 py-10">
            <Card className="w-full max-w-lg border-green-200 bg-white/95 shadow-2xl shadow-green-100">
                <CardHeader>
                    <CardTitle className="text-center text-green-600">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-zinc-900">Thank You!</h2>
                    <p className="mt-2 text-center text-sm text-zinc-600">
                        Your payment has been successfully processed and verified.
                    </p>
                    <div className="mt-6 w-full rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Product:</span>
                                <span className="font-semibold text-zinc-900">Harpic 500ml</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Amount:</span>
                                <span className="font-semibold text-zinc-900">NPR 120.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Payment Method:</span>
                                <span className="font-semibold capitalize text-zinc-900">
                                    {searchParams.get("payment")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Status:</span>
                                <span className="font-semibold text-green-600">Verified ✓</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-6 text-center text-xs text-zinc-500">
                        A confirmation email has been sent to your registered email address.
                    </p>
                    <div className="mt-6">
                        <Link href="/">
                            <button className="rounded-lg border-2 border-green-600 bg-green-600 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-green-700">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
