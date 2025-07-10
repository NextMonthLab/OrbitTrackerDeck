import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // NextMonth OS colors
        'nextm-dark': 'hsl(var(--nextm-dark))',
        'nextm-darker': 'hsl(var(--nextm-darker))',
        'nextm-gray': 'hsl(var(--nextm-gray))',
        'nextm-light': 'hsl(var(--nextm-light))',
        // Military theme colors
        'military-olive': 'hsl(var(--military-olive))',
        'military-khaki': 'hsl(var(--military-khaki))',
        'military-tactical': 'hsl(var(--military-tactical))',
        'military-dark': 'hsl(var(--military-dark))',
        'military-amber': 'hsl(var(--military-amber))',
        // Neon accents
        'neon-cyan': 'hsl(var(--neon-cyan))',
        'neon-blue': 'hsl(var(--neon-blue))',
        'neon-green': 'hsl(var(--neon-green))',
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'stencil': ['Impact', 'Arial Black', 'sans-serif']
      },
      backgroundImage: {
        'military-gradient': 'linear-gradient(135deg, hsl(var(--military-dark)) 0%, hsl(var(--military-olive)) 50%, hsl(var(--military-tactical)) 100%)',
        'nextm-gradient': 'linear-gradient(135deg, hsl(var(--nextm-dark)) 0%, hsl(var(--nextm-gray)) 50%, hsl(var(--nextm-light)) 100%)',
        'cinematic-gradient': 'radial-gradient(ellipse at center, hsla(var(--neon-cyan), 0.1) 0%, hsla(var(--neon-blue), 0.05) 50%, transparent 100%)'
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "tactical-blink": {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0.3" }
        },
        "orbit-rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "tactical-blink": "tactical-blink 2s ease-in-out infinite alternate",
        "orbit-rotate": "orbit-rotate 20s linear infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
