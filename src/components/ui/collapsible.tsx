
import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      ref={ref}
      className={cn(
        isMobile ? "text-sm py-1.5" : "py-2",
        className
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleTrigger>
  );
});

CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  
  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      className={cn(
        isMobile ? "text-sm" : "",
        className
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
});

CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
