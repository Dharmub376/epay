"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();
    const [step, setStep] = useState<"signup" | "otp">("signup");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [otpData, setOtpData] = useState({
        otp: "",
        email: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Signup failed");
                setLoading(false);
                return;
            }

            setOtpData(prev => ({ ...prev, email: formData.email }));
            setSuccess("OTP sent to your email. Please verify.");
            setStep("otp");
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!otpData.otp) {
            setError("Please enter the OTP");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: otpData.email,
                    otp: otpData.otp,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "OTP verification failed");
                setLoading(false);
                return;
            }

            setSuccess("Email verified! Redirecting to login...");
            setTimeout(() => {
                router.push("/checkout");
            }, 2000);
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4 py-10">
            <Card className="w-full max-w-lg overflow-hidden border-red-200 bg-white/95 shadow-2xl shadow-red-100 backdrop-blur-sm">
                {/* Header */}
                <div className="border-b border-red-100 bg-gradient-to-r from-red-50 to-white px-6 py-4">
                    <h1 className="text-lg font-semibold text-red-700">
                        {step === "signup" ? "Create New Account" : "Verify Email"}
                    </h1>
                    <p className="text-xs text-zinc-600 mt-1">
                        {step === "signup"
                            ? "Sign up to complete your purchase and track orders"
                            : "Enter the OTP sent to your email"}
                    </p>
                </div>

                {/* Product Summary */}
                <CardHeader className="flex flex-row items-center gap-4 border-b border-red-100 bg-red-50/40 px-6 py-4">
                    <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-red-100 bg-white">
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

                {/* Form Content */}
                <CardContent className="space-y-4 px-6 py-6">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    {step === "signup" ? (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="+977 98..."
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Create Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="Min 8 characters"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Re-enter password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
                                <input type="checkbox" id="terms" className="h-4 w-4 rounded border-zinc-300 accent-red-600" />
                                <label htmlFor="terms" className="text-xs text-zinc-700">
                                    I agree to the <a href="#" className="font-semibold text-blue-700 hover:underline">terms and conditions</a>
                                </label>
                            </div>

                            <div className="text-center text-xs text-zinc-600 pt-2">
                                Already have an account? <Link href="/checkout" className="font-semibold text-red-600 hover:underline">Sign in here</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg border-2 border-red-600 bg-red-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md hover:shadow-red-200 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div>
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input
                                    id="otp"
                                    placeholder="000000"
                                    type="text"
                                    maxLength={6}
                                    value={otpData.otp}
                                    onChange={(e) => setOtpData(prev => ({ ...prev, otp: e.target.value }))}
                                    disabled={loading}
                                />
                            </div>

                            <p className="text-xs text-zinc-600 text-center">
                                OTP has been sent to <span className="font-semibold">{otpData.email}</span>
                            </p>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg border-2 border-red-600 bg-red-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md hover:shadow-red-200 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Verifying..." : "Verify & Create Account"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep("signup");
                                    setOtpData({ otp: "", email: "" });
                                    setError("");
                                }}
                                className="w-full rounded-lg border-2 border-zinc-300 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-wide text-zinc-700 transition hover:border-zinc-400 hover:shadow-sm active:scale-95"
                            >
                                Back
                            </button>
                        </form>
                    )}
                </CardContent>

                {/* Actions */}
                {step === "signup" && (
                    <CardFooter className="border-t border-red-100 bg-white/50 px-6 py-4">
                        <Link href="/" className="w-full">
                            <button className="w-full rounded-lg border-2 border-zinc-300 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-wide text-zinc-700 transition hover:border-zinc-400 hover:shadow-sm active:scale-95">
                                Back to Shop
                            </button>
                        </Link>
                    </CardFooter>
                )}
            </Card>
        </main>
    );
}
