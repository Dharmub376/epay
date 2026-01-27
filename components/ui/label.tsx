import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const Label = React.forwardRef<
    React.ElementRef<"label">,
    React.ComponentPropsWithoutRef<"label">
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "block text-xs font-semibold uppercase tracking-wide text-zinc-700 mb-2",
            className
        )}
        {...props}
    />
));
Label.displayName = "Label";

export { Label };
