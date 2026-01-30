"use client";

import { CreditCard, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentOption {
    id: string;
    name: string;
    logo: string;
    description: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
    {
        id: "visa",
        name: "Visa / Mastercard",
        logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/visa.svg",
        description: "Pay securely with your credit or debit card",
    },
    {
        id: "khalti",
        name: "Khalti",
        logo: "https://web.khalti.com/static/img/logo1.png",
        description: "Pay with Khalti digital wallet",
    },
    {
        id: "esewa",
        name: "eSewa",
        logo: "https://esewa.com.np/common/images/esewa-logo.png",
        description: "Pay with eSewa digital wallet",
    },
];

export default function PaymentOptionsPage() {
    const router = useRouter();
    const [selectedPayment, setSelectedPayment] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleContinue = async () => {
        if (!selectedPayment) {
            alert("Please select a payment method");
            return;
        }

        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            // Navigate to appropriate payment gateway or confirmation
            if (selectedPayment === "visa") {
                router.push("/checkout/payment");
            } else {
                // For Khalti and eSewa, you would integrate their payment gateways here
                console.log(`Processing payment with ${selectedPayment}`);
                // router.push("/checkout/confirmation");
            }
        }, 1000);
    };

    return (
        <section className="py-16 md:py-24">
            <div className="container max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Select Payment Method
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Choose how you would like to pay for your order
                    </p>
                </div>

                {/* Payment Options */}
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                    <div className="space-y-4">
                        {PAYMENT_OPTIONS.map((option) => (
                            <Card
                                key={option.id}
                                className={cn(
                                    "cursor-pointer transition-all hover:border-primary/50",
                                    selectedPayment === option.id && "border-primary ring-2 ring-primary/20",
                                )}
                                onClick={() => setSelectedPayment(option.id)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <RadioGroupItem value={option.id} id={option.id} />

                                        {/* Payment Logo */}
                                        <div className="flex h-12 w-20 items-center justify-center rounded-md border bg-white p-2">
                                            <img
                                                src={option.logo}
                                                alt={option.name}
                                                className="h-full w-full object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.innerHTML = `<div class="flex items-center justify-center h-full"><svg class="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg></div>`;
                                                }}
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <Label
                                                htmlFor={option.id}
                                                className="cursor-pointer font-semibold text-base"
                                            >
                                                {option.name}
                                            </Label>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {option.description}
                                            </p>
                                        </div>

                                        {/* Selected Indicator */}
                                        {selectedPayment === option.id && (
                                            <CheckCircle2 className="h-6 w-6 text-primary" />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </RadioGroup>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/checkout/delivery")}
                        disabled={isProcessing}
                        className="w-full sm:w-auto"
                    >
                        Back to Delivery
                    </Button>
                    <Button
                        onClick={handleContinue}
                        disabled={!selectedPayment || isProcessing}
                        className="w-full sm:w-auto"
                    >
                        {isProcessing ? (
                            <>
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Processing...
                            </>
                        ) : (
                            "Continue to Payment"
                        )}
                    </Button>
                </div>

                {/* Order Summary */}
                <Card className="mt-8 bg-muted/50">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">NPR 2,500.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery Fee</span>
                                <span className="font-medium">NPR 100.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax (13%)</span>
                                <span className="font-medium">NPR 325.00</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between text-base">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold">NPR 2,925.00</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Notice */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                </div>
            </div>
        </section>
    );
}
