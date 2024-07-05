const config = {
  plugins: [
    require('postcss-px-to-viewport')({
        viewportWidth: 750,
    }),
  ],
};

module.exports = config;
