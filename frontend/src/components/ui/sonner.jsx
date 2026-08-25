import { Toaster as Sonner } from "sonner"

function Toaster(props) {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--success-bg": "#4f6f52",
        "--success-text": "#fbf7f0",
        "--success-border": "#4f6f52",
        "--error-bg": "#b33f2e",
        "--error-text": "#fbf7f0",
        "--error-border": "#b33f2e",
      }}
      {...props}
    />
  )
}

export { Toaster }
