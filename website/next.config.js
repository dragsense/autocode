const withPlugins = require("next-compose-plugins");
const withImages = require('next-images');


module.exports = withPlugins([[withImages, { crossOrigin: 'anonymous' }]], {
    async headers() {
      return [
        {
            source: "/uploads/fonts/:path*",
            headers: [
            { key: "Access-Control-Allow-Origin", value: "*" },
          ],
        },
      ];
    },
  });