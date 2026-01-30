"use client";

import {
  CreditCard,
  MoreVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "paypal";
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
  isDefault: boolean;
}

const DEFAULT_METHODS: PaymentMethod[] = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: 8,
    expiryYear: 2025,
    isDefault: false,
  },
  {
    id: "3",
    type: "paypal",
    email: "john@example.com",
    isDefault: false,
  },
];

const PAYMENT_LOGOS: Record<string, string> = {
  visa: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/visa.svg",
  mastercard: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/mastercard.svg",
  amex: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/amex.svg",
  paypal: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/paypal.svg",
};

interface PaymentMethods1Props {
  methods?: PaymentMethod[];
  className?: string;
}

const PaymentMethods1 = ({
  methods: initialMethods = DEFAULT_METHODS,
  className,
}: PaymentMethods1Props) => {
  const [methods, setMethods] = useState(initialMethods);
  const [selectedId, setSelectedId] = useState(
    methods.find((m) => m.isDefault)?.id || methods[0]?.id,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PaymentMethod>>({});

  const startEditing = (method: PaymentMethod) => {
    setEditingId(method.id);
    setEditForm({ ...method });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (
      editingId &&
      editForm.type &&
      (editForm.type === "paypal"
        ? editForm.email
        : editForm.last4 && editForm.expiryMonth && editForm.expiryYear)
    ) {
      setMethods((prev) =>
        prev.map((method) =>
          method.id === editingId
            ? ({
                ...method,
                ...editForm,
              } as PaymentMethod)
            : method,
        ),
      );
      setEditingId(null);
      setEditForm({});
    }
  };

  const startAddingNew = () => {
    setIsAddingNew(true);
    setEditForm({
      type: "visa",
      last4: "",
      expiryMonth: undefined,
      expiryYear: undefined,
      email: undefined,
      isDefault: methods.length === 0,
    });
  };

  const cancelAddingNew = () => {
    setIsAddingNew(false);
    setEditForm({});
  };

  const saveNewMethod = () => {
    if (
      editForm.type &&
      (editForm.type === "paypal"
        ? editForm.email
        : editForm.last4 && editForm.expiryMonth && editForm.expiryYear)
    ) {
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: editForm.type as "visa" | "mastercard" | "amex" | "paypal",
        last4: editForm.last4,
        expiryMonth: editForm.expiryMonth,
        expiryYear: editForm.expiryYear,
        email: editForm.email,
        isDefault: methods.length === 0,
      };
      setMethods((prev) => [...prev, newMethod]);
      setIsAddingNew(false);
      setEditForm({});
      if (methods.length === 0) {
        setSelectedId(newMethod.id);
      }
    }
  };

  const deleteMethod = (id: string) => {
    setMethods((prev) => prev.filter((method) => method.id !== id));
    if (selectedId === id && methods.length > 1) {
      setSelectedId(methods.find((m) => m.id !== id)?.id || "");
    }
    if (editingId === id) {
      setEditingId(null);
      setEditForm({});
    }
  };

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Payment Methods
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your saved payment methods
            </p>
          </div>
          <Button onClick={startAddingNew}>
            <Plus className="mr-2 size-4" />
            Add New
          </Button>
        </div>

        {/* Payment Methods List */}
        <RadioGroup value={selectedId} onValueChange={setSelectedId}>
          <div className="space-y-3">
            {methods.map((method) => (
              <Card
                key={method.id}
                className={cn(
                  "cursor-pointer gap-0 p-0 transition-colors",
                  selectedId === method.id &&
                    editingId !== method.id &&
                    "border-primary",
                  editingId === method.id && "border-primary",
                )}
                onClick={() =>
                  editingId !== method.id && setSelectedId(method.id)
                }
              >
                <CardContent className="p-4">
                  {editingId === method.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Edit Payment Method</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditing();
                            }}
                          >
                            <X className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEdit();
                            }}
                          >
                            <Save className="mr-2 size-4" />
                            Save
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`type-${method.id}`}>Card Type</Label>
                          <Select
                            value={editForm.type || "visa"}
                            onValueChange={(
                              value: "visa" | "mastercard" | "amex" | "paypal",
                            ) => setEditForm({ ...editForm, type: value })}
                          >
                            <SelectTrigger
                              id={`type-${method.id}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="visa">Visa</SelectItem>
                              <SelectItem value="mastercard">
                                Mastercard
                              </SelectItem>
                              <SelectItem value="amex">
                                American Express
                              </SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {editForm.type === "paypal" ? (
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor={`email-${method.id}`}>
                              PayPal Email
                            </Label>
                            <Input
                              id={`email-${method.id}`}
                              type="email"
                              value={editForm.email || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  email: e.target.value,
                                })
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor={`last4-${method.id}`}>
                                Last 4 Digits
                              </Label>
                              <Input
                                id={`last4-${method.id}`}
                                maxLength={4}
                                value={editForm.last4 || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    last4: e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 4),
                                  })
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`expiryMonth-${method.id}`}>
                                Expiry Month
                              </Label>
                              <Input
                                id={`expiryMonth-${method.id}`}
                                type="number"
                                min={1}
                                max={12}
                                value={editForm.expiryMonth || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    expiryMonth:
                                      parseInt(e.target.value) || undefined,
                                  })
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`expiryYear-${method.id}`}>
                                Expiry Year
                              </Label>
                              <Input
                                id={`expiryYear-${method.id}`}
                                type="number"
                                min={new Date().getFullYear()}
                                value={editForm.expiryYear || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    expiryYear:
                                      parseInt(e.target.value) || undefined,
                                  })
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <RadioGroupItem value={method.id} id={method.id} />

                      {/* Payment Logo */}
                      <div className="flex size-12 items-center justify-center">
                        {PAYMENT_LOGOS[method.type] ? (
                          <img
                            src={PAYMENT_LOGOS[method.type]}
                            alt={method.type}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <CreditCard className="size-6 text-muted-foreground" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {method.type === "paypal"
                              ? "PayPal"
                              : `${method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• ${method.last4}`}
                          </span>
                          {method.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {method.type === "paypal"
                            ? method.email
                            : `Expires ${method.expiryMonth}/${method.expiryYear}`}
                        </p>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(method);
                            }}
                          >
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMethod(method.id);
                            }}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {isAddingNew && (
              <Card className="gap-0 border-primary p-0">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Add New Payment Method</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelAddingNew}
                        >
                          <X className="size-4" />
                        </Button>
                        <Button size="sm" onClick={saveNewMethod}>
                          <Save className="mr-2 size-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-type">Card Type</Label>
                        <Select
                          value={editForm.type || "visa"}
                          onValueChange={(
                            value: "visa" | "mastercard" | "amex" | "paypal",
                          ) => setEditForm({ ...editForm, type: value })}
                        >
                          <SelectTrigger id="new-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visa">Visa</SelectItem>
                            <SelectItem value="mastercard">
                              Mastercard
                            </SelectItem>
                            <SelectItem value="amex">
                              American Express
                            </SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {editForm.type === "paypal" ? (
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="new-email">PayPal Email</Label>
                          <Input
                            id="new-email"
                            type="email"
                            value={editForm.email || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="new-last4">Last 4 Digits</Label>
                            <Input
                              id="new-last4"
                              maxLength={4}
                              value={editForm.last4 || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  last4: e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 4),
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-expiryMonth">
                              Expiry Month
                            </Label>
                            <Input
                              id="new-expiryMonth"
                              type="number"
                              min={1}
                              max={12}
                              value={editForm.expiryMonth || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  expiryMonth:
                                    parseInt(e.target.value) || undefined,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-expiryYear">Expiry Year</Label>
                            <Input
                              id="new-expiryYear"
                              type="number"
                              min={new Date().getFullYear()}
                              value={editForm.expiryYear || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  expiryYear:
                                    parseInt(e.target.value) || undefined,
                                })
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </RadioGroup>

        {methods.length === 0 && (
          <Card className="p-0">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="mb-4 size-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No payment methods</h2>
              <p className="mt-2 text-muted-foreground">
                Add a payment method for faster checkout
              </p>
              <Button className="mt-4" onClick={startAddingNew}>
                <Plus className="mr-2 size-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export { PaymentMethods1 };
