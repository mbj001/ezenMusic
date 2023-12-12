


// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = (app) => {
//     app.use(
//         "/client",
//         createProxyMiddleWare({
//             target: "http://localhost:3001",
//             changeOrigin: true
//         })
//     )
// }

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        "/ezenmusic",
        createProxyMiddleware({
            target: "http://localhost:8080",
            changeOrigin: true
        })
    )

    app.use(
        "/playerHandle",
        createProxyMiddleware({
            target: "http://localhost:8080",
            changeOrigin: true
        })
    )

    app.use(
        "/verifiedClient",
        createProxyMiddleware({
            target: "http://localhost:8080",
            changeOrigin: true
        })
    )

    app.use(
        "/playlist",
        createProxyMiddleware({
            target: "http://localhost:8080",
            changeOrigin: true
        })
    )

    app.use(
        "/client",
        createProxyMiddleware({
            target: "http://localhost:8080",
            changeOrigin: true
        })
    )

    app.use(
        "/guest",
        createProxyMiddleware({
            target: "http://localhost:8080",
            changeOrigin: true
        })
    )

    app.use(
        "/login",
        createProxyMiddleware({
            target: "http://localhost:8080",
            changeOrigin: true
        })
    )
}