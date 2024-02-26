import { PrismaClient } from "@prisma/client";
import Router from "koa-router";
import dotenv from "dotenv";
import { generateSHA, getShopCipher, getTokens } from "../auth";
import { deleteIntegration, getShop, getUserId, processDatabase, saveInteg } from "../controller";
import { getAuthShop, getOrders } from "../controller/tiktokController";

dotenv.config();

const prisma = new PrismaClient();

const router = new Router();

let SHOP_CIPHER = "";

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

    const { signCipher, timestampCipher } = await getShopCipher();
    const authShop = await getAuthShop(signCipher, timestampCipher, ctx);
    const shop_cipher = authShop?.data?.data?.shops[0].cipher;
    SHOP_CIPHER = shop_cipher;

    const integID = await saveInteg(
      ctx,
      userId,
      access_token,
      access_token_expire_in,
      refresh_token,
      refresh_token_expire_in,
      seller_name,
      shop_cipher
    );

    console.log(integID, "integID");

    ctx.status = 301;
    //* after redirecting to the url, frontend will fireup to pass the auth token and extract the user_id of the user
    //* and called the route /ecomm/tiktok/process/:id
    ctx.redirect(`${process.env.REDIRECT_TO}?ecomm=tiktok&i=${integID}`);
  } catch (error: any) {
    console.error("Error:", error);
    console.error("Response Data:", error.response ? error.response.data : "No response data");
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
});

router.get("/ecomm/tiktok/orders/get/:id", async (ctx) => {
  try {
    // const shop_cipher = "TTP_CTgI5gAAAAALMLVw3mlheTH9Yg6LW7Ji";
    const { sign, timestamp } = await generateSHA(SHOP_CIPHER, ctx);
    console.log(sign, timestamp);
    const orders = await getOrders(sign, timestamp, ctx);
    console.log(orders?.data?.data, "orders");
  } catch (error: any) {
    console.error("Error:", error);
    console.error("Response Data:", error.response ? error.response.data : "No response data");
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
});

router.delete("/ecomm/tiktok/integ/delete/:id", async (ctx) => {
  try {
    await deleteIntegration(ctx);
  } catch (error: any) {
    console.error("Error:", error);
    console.error("Response Data:", error.response ? error.response.data : "No response data");
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
});

router.patch("/ecomm/tiktok/process/:id", async (ctx) => {
  console.log("Finalizing route is fired!");
  try {
    await processDatabase(ctx);
  } catch (error: any) {
    console.error("Error:", error);
    console.error("Response Data:", error.response ? error.response.data : "No response data");
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
});

export default router;
