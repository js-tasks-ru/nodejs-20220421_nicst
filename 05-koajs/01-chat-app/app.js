const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let message = '';
let subscrCount = 0;

async function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

router.get('/subscribe', async (ctx, next) => {
  subscrCount++;
  const p = new Promise(async (resolve, reject) => {
    while (!message) {
      await sleep();
    }
    resolve(message);
  });
  const msg = await p;
  ctx.body = msg;
  subscrCount--;
  if (!subscrCount) {
    message = '';
  }
});

router.post('/publish', async (ctx, next) => {
  message = ctx.request.body.message;
  ctx.status = 201;
});

app.use(router.routes());

module.exports = app;
