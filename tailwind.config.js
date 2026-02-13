/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                body: ['"Roboto"', 'sans-serif']
            },
            screens: {
                'print': {'raw': 'print'},
            }
        },
    },
    plugins: [],
}
