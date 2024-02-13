import Router from "koa-router";

const router = new Router();

router.get("/ping", async (ctx) => {
  try {
    ctx.body = {
      status: "success",
      data: "pong",
      market: "Tiktok Shop",
    };
  } catch (error) {
    console.log(error, "error");
  }
});

export default router;
