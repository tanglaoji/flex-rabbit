const BASE_URL = process.env.NODE_ENV === "production" ? "/flex-rabbit/" : "/"

module.exports = {
  productionSourceMap: false,
  publicPath: BASE_URL,
  devServer: {
    // Open the browser automatically
    open: true
  }
}