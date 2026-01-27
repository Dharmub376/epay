import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const Input = React.forwardRef<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<"input">
>(({ className, type, ...props }, ref) => (
    <input
        type={type}
        className={cn(
            "flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        ref={ref}
        {...props}
    />
));
Input.displayName = "Input";

export { Input };
