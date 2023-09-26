const express = require('express');
const fs = require('fs');
const path = require('path');
// import testHtml from './test.html';
const resolve = (p)=>path.resolve(_dirname, p);
const createServer = async (root = process.cwd(), isProd = process.env.NODE.ENV === "production")=>{
  const app = express();
    let vite;
    let { createServer: _createServer } = require("vite");
    vite = await _createServer({
        root,
        server: {
            middlewareMode: true,
            watch: {
                usePolling: true,
                interval: 100,
            },
        },
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res) => {
        const { originalUrl: url } = req;
        try {
            let template, render;
            // 读取模版
            template = fs.readFileSync(resolve("index.html"), "utf-8");
            template = await vite.transformIndexHtml(url, template);
            render = (await vite.ssrLoadModule("./src/entry-server.js")).render;

            let { html } = await render();
            // 替换模版中的标记
            html = template.replace(`<!--app-html-->`, html);
            // html = template.replace(testHtml, html);
            // 响应
            res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (e) {
            isProd || vite.ssrFixStacktrace(e);
            console.error(`[error]`, e.stack);
            res.status(500).end(e.stack);
        }
    });

    return { app };
}


// app.use("*", async(req,res)=>{
//   const html = testHtml;
//   res.status(200).send({"Content-Type": "text/html"}).end(html)
// });
// app.listen(8086)
createServer().then(({ app })=>{
  app.listen(8086)
})