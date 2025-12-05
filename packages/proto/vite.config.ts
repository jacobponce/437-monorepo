import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "public/index.html"),
        login: resolve(__dirname, "public/login.html"),
        register: resolve(__dirname, "public/register.html"),
        account: resolve(__dirname, "public/account.html"),
        createListing: resolve(__dirname, "public/create-listing.html"),
        createAuction: resolve(__dirname, "public/create-auction.html"),
        marketplace: resolve(__dirname, "public/marketplace.html"),
        shop: resolve(__dirname, "public/golf-shop.html"),
        advice: resolve(__dirname, "public/swing-advice.html"),
        auctions: resolve(__dirname, "public/auctions.html"),
        item1: resolve(__dirname, "public/marketplace-item.html"),
        item2: resolve(__dirname, "public/marketplace-item2.html"),
        item3: resolve(__dirname, "public/marketplace-item3.html"),
        comments: resolve(__dirname, "public/swing-comments.html"),
        videos: resolve(__dirname, "public/swing-videos.html"),
        video: resolve(__dirname, "public/video.html")
      }
    },
    outDir: "../dist"
  },
  root: "public",
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true
      },
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
});
