"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setError("");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.email || !formData.password) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            // Store user info in localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            
            // Redirect to delivery page
            router.push("/checkout/delivery");
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
                    <h1 className="text-lg font-semibold text-red-700">Login to Continue</h1>
                    <p className="text-xs text-zinc-600 mt-1">Sign in to your account to proceed with checkout</p>
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

                {/* Login Form */}
                <CardContent className="space-y-4 px-6 py-6">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded border-zinc-300 accent-red-600"
                                />
                                <span className="text-zinc-600">Remember me</span>
                            </label>
                            <a href="#" className="font-semibold text-red-600 hover:text-red-700">
                                Forgot password?
                            </a>
                        </div>

                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-zinc-700">
                            💡 <span className="ml-2">Don't have an account? <Link href="/checkout/signup" className="font-semibold text-blue-700 hover:underline">Create one here</Link></span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg border-2 border-red-600 bg-red-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md hover:shadow-red-200 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign In & Continue"}
                        </button>
                    </form>
                </CardContent>

                {/* Actions */}
                <CardFooter className="border-t border-red-100 bg-white/50 px-6 py-4">
                    <Link href="/" className="w-full">
                        <button className="w-full rounded-lg border-2 border-zinc-300 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-wide text-zinc-700 transition hover:border-zinc-400 hover:shadow-sm active:scale-95">
                            Back to Shop
                        </button>
                    </Link>
                </CardFooter>
            </Card>
        </main>
    );
}
