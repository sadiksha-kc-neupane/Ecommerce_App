import { cn } from "../../lib/utils.js"
import { buttonVariants } from "./buttonVariants.js"

export default function Button({ variant = "primary", size = "md", className, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
