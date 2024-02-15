import Router from "koa-router";
import dotenv from "dotenv";
import { getTokens } from "../auth";
import { saveInteg } from "../controller";

dotenv.config();

const router = new Router();

router.get("/", async (ctx) => {
  ctx.redirect("/ecomm/tiktok/ping");
});

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

router.get("/url", async (ctx) => {
  console.log(ctx, "this is the ctx");
});

router.get("/ecomm/tiktok/auth", async (ctx) => {
  try {
    const authorizationCode = ctx.query.code;

    const response = await getTokens(authorizationCode);
    const data = response?.data?.data;
    // console.log(data, "data");

    const {
      access_token,
      access_token_expire_in,
      refresh_token,
      refresh_token_expire_in,
      seller_name,
    } = data;

    const userId = 3;

    const integID = await saveInteg(
      ctx,
      userId,
      access_token,
      access_token_expire_in,
      refresh_token,
      refresh_token_expire_in,
      seller_name
    );

    console.log(integID, "integID");

    ctx.status = 301;
    ctx.redirect(`${process.env.REDIRECT_TO}?ecomm=wix&i=${integID}`);
  } catch (error: any) {
    console.error("Error:", error);
    console.error("Response Data:", error.response ? error.response.data : "No response data");
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
});

export default router;
