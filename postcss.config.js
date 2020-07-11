const pxtorem = require('postcss-pxtorem');

module.exports = {
  plugins: [
    require('autoprefixer')({
      cascade: false,
    }),
    pxtorem({
      rootValue: 37.5,
      propWhiteList: [] // Enables converting of all properties – default is just font sizes.
    })
  ]
}