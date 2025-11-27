// INFO :  IT CAN ALSO BE NAMED babel.config.json 
export default {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
        ['babel-plugin-react-compiler', { target: '19' }]
    ]
};
