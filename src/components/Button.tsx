// Tremor Button [v0.2.0]

import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { RiLoader2Fill } from "@remixicon/react"
import { tv, type VariantProps } from "tailwind-variants"

import { cx, focusRing } from "@/lib/utils"

const buttonVariants = tv({
  base: [
    // base
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg border text-center font-medium transition-all duration-200 ease-out",
    // disabled
    "disabled:pointer-events-none disabled:opacity-50",
    // focus
    focusRing,
  ],
  variants: {
    variant: {
      primary: [
        // border
        "border-transparent",
        // text color
        "text-white",
        // background color
        "bg-gray-900 dark:bg-white dark:text-gray-900",
        // hover color
        "hover:bg-gray-800 dark:hover:bg-gray-100",
        // active
        "active:scale-[0.98]",
      ],
      secondary: [
        // border
        "border-gray-200 dark:border-gray-800",
        // text color
        "text-gray-900 dark:text-gray-50",
        // background color
        "bg-white dark:bg-gray-950",
        // hover color
        "hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-900 dark:hover:border-gray-700",
        // active
        "active:scale-[0.98]",
      ],
      light: [
        // border
        "border-transparent",
        // text color
        "text-gray-700 dark:text-gray-300",
        // background color
        "bg-gray-100 dark:bg-gray-800",
        // hover color
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        // active
        "active:scale-[0.98]",
      ],
      ghost: [
        // border
        "border-transparent",
        // text color
        "text-gray-700 dark:text-gray-300",
        // background
        "bg-transparent",
        // hover color
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        // active
        "active:scale-[0.98]",
      ],
      destructive: [
        // border
        "border-transparent",
        // text color
        "text-white",
        // background color
        "bg-red-600 dark:bg-red-600",
        // hover color
        "hover:bg-red-700 dark:hover:bg-red-500",
        // active
        "active:scale-[0.98]",
      ],
    },
    size: {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-11 px-5 text-sm gap-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isLoading = false,
      loadingText,
      className,
      disabled,
      variant,
      size,
      children,
      ...props
    }: ButtonProps,
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : "button"
    return (
      <Component
        ref={forwardedRef}
        className={cx(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        tremor-id="tremor-raw"
        {...props}
      >
        {isLoading ? (
          <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
            <RiLoader2Fill
              className="size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
            <span className="sr-only">
              {loadingText ? loadingText : "Loading"}
            </span>
            {loadingText ? loadingText : children}
          </span>
        ) : (
          children
        )}
      </Component>
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants, type ButtonProps }
