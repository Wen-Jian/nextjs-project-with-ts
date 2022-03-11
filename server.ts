const { parse } = require('url');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const Koa = require('koa');
const Router = require('koa-router');
const handle = app.getRequestHandler();

const port = 8080;
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  router.get(/^\/_next[\w\W\d\D]+/gi, async (ctx: any) => {
    const { req, res } = ctx;
    await handle(req, res);
  });
  router.get(':splat*', async (ctx: any) => {
    const parsedUrl = {
      ...parse(ctx.request.url, true),
      path: '/image_processor',
      href: '/image_processor',
    };
    const { req, res } = ctx;
    await handle(req, res, parsedUrl);
    ctx.respond = false;
  });
  router.get(/\/./, async (ctx: any) => {
    const parsedUrl = parse(ctx.request.url, true);
    const { req, res } = ctx;
    await handle(req, res, parsedUrl);
    ctx.respond = false;
  });

  server.use(router.routes()).listen(port);
  console.log(`listening on port ${port}`);
});

export {};
