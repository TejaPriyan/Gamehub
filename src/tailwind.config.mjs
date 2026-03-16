/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.03em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '500' }],
                xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '0.06em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.07em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '0.08em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '1.1', letterSpacing: '0.09em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '0.1em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '0.11em', fontWeight: '800' }],
                '7xl': ['4.5rem', { lineHeight: '1.0', letterSpacing: '0.12em', fontWeight: '800' }],
                '8xl': ['6rem', { lineHeight: '1.0', letterSpacing: '0.13em', fontWeight: '900' }],
                '9xl': ['8rem', { lineHeight: '1.0', letterSpacing: '0.14em', fontWeight: '900' }],
            },
            fontFamily: {
                heading: "madefor-display",
                paragraph: "azeret-mono"
            },
            colors: {
                'accent-cyan': '#00FFFF',
                'accent-magenta': '#FF00FF',
                'accent-purple': '#8A2BE2',
                'dark-background': '#1A1A2E',
                'light-foreground': '#E0E0E0',
                destructive: '#FF0000',
                'destructive-foreground': '#FFFFFF',
                background: '#1A1A2E',
                secondary: '#FF00FF',
                foreground: '#E0E0E0',
                'secondary-foreground': '#FFFFFF',
                'primary-foreground': '#000000',
                primary: '#00FFFF'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
