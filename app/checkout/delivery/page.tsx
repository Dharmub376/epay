"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeliveryPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/checkout");
            return;
        }
        setUser(JSON.parse(userStr));
        setFormData(prev => ({ ...prev, fullName: JSON.parse(userStr).name }));
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.fullName || !formData.phone || !formData.address) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        try {
            // Here you would normally place the order
            setSuccess("Order placed successfully!");
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (err) {
            setError("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4 py-10">
            <Card className="w-full max-w-lg overflow-hidden border-red-200 bg-white/95 shadow-2xl shadow-red-100 backdrop-blur-sm">
                {/* Header */}
                <div className="border-b border-red-100 bg-gradient-to-r from-red-50 to-white px-6 py-4">
                    <h1 className="text-lg font-semibold text-red-700">Delivery Details</h1>
                    <p className="text-xs text-zinc-600 mt-1">Enter delivery address to complete your order</p>
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

                {/* Form */}
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

                    <form onSubmit={handlePlaceOrder} className="space-y-4">
                        <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Your full name"
                                type="text"
                                value={formData.fullName}
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
                            <Label htmlFor="address">Delivery Address</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="Street address, city"
                                type="text"
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800">
                            📦 Delivery is <span className="font-semibold">FREE</span> across all areas. Estimated delivery: 2-3 business days.
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg border-2 border-red-600 bg-red-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md hover:shadow-red-200 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Placing order..." : "Place Order"}
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
