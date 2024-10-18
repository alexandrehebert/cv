/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.pug"],
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
