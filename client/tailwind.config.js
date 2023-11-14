const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            "sm": "576px",
            "md": "800px",
            "lg": "1024px",
            'medium': { 'raw': '(min-height: 400px)' },
            'tall': { 'raw': '(min-height: 500px)' },
        },
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                "mlops-primary-tx": "#012970",
                "mlops-primary-tx-dark": "#ffffff",
                "mlops-secondary-tx": "#6c757d",
                "mlops-secondary-tx-dark": "#6c757d",
                "mlops-primary-bg": "#f3f6fd",
                "mlops-primary-bg-dark": "#2f2b3a",
                "mlops-action-hover-bg": "#e0e7ffa6",
                "mlops-nav-active-bg": "#e0e7ff73",
                "mlops-action-hover-bg-dark": "#4b5563",
                "mlops-nav-active-bg-dark": "#4b5563bf",
                "mlops-nav-bg": "#ffffff",
                "mlops-nav-bg-dark": "#111827",
                "mlops-violet": "#4154f1",
                "mlops-gray": "#899bbd",
                "mlops-not-started": "#3b7ddd",
                "mlops-in-progress": "#fcb92c",
                "mlops-completed": "#1cbb8c",
                "mlops-archived": "#ced4da",
                "mlops-tabs-hover": "#e4e4e7a6",
                "mlops-primary": "#0d6efd",
                "mlops-danger": "#e74c3c",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                mlops_text_tertiary: "#4154f1",
                mlops_bg_primary: "#f3f6fd",
                mlops_bg_secondary: "#ffffff",
                mlops_bg_tertiary: "#f2f4ff",
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            fontFamily: {
                logo: ["Orbitron", "sans-serif"],
                ellipsis: ["font-ellipsis", "sans-serif"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            boxShadow: {
                primary: "0 0 20px rgba(1, 41, 112, 0.1)!important",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), nextui()],
};
