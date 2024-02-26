import { PrismaClient } from "@prisma/client";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
import CryptoJS from "crypto-js";
import queryString from "querystring";
import tiktokShop from "tiktok-shop";

dotenv.config();

const prisma = new PrismaClient();

const AUTH_PROVIDER_BASE_URL = "https://auth.tiktok-shops.com";
const app_secret: any = process.env.APP_SECRET;
const app_key: any = process.env.APP_KEY;

export const getTokens = async (authorizationCode) => {
  try {
    const app_key = process.env.APP_KEY;
    const app_secret = process.env.APP_SECRET;

    const response = axios.get(
      `${AUTH_PROVIDER_BASE_URL}/api/v2/token/get?app_key=${app_key}&auth_code=${authorizationCode}&app_secret=${app_secret}&grant_type=authorized_code`,
      { headers: { "Content-Type": "application/json" } }
    );

    return response;
  } catch (error: any) {
    console.error;
    console.error("Response Data:", error.response ? error.response.data : "No response data");
  }
};

export const generateSHA = async (shop_cipher: any, ctx: any) => {
  // * 202309 version
  // console.log("Fired!");
  // const timeStamp = Math.floor(Date.now() / 1000);
  // // const timeStamp = new Date().getTime() / 1000;
  // const path = "/order/202309/orders/search";

  // const plainText = `${app_secret}${path}app_key${app_key}page_size1shop_cipher${shop_cipher}timestamp${timeStamp}${app_secret}`;
  // console.log(plainText, "plainText");

  // const signature = crypto.createHmac("sha256", app_secret).update(plainText).digest("hex");
  // // const signature = CryptoJS.HmacSHA256(plainText, app_secret).toString();

  // console.log(typeof signature, "type of signature");

  // return {
  //   sign: signature,
  //   timestamp: timeStamp,
  // };
  // * 202309 version

  //* 202212
  console.log("Fired!");
  const timeStamp = Math.floor(Date.now() / 1000);
  // const timeStamp = new Date().getTime() / 1000;
  const path = "/api/orders/search";

  const plainText = `${app_secret}${path}app_key${app_key}page_size100shop_cipher${shop_cipher}timestamp${timeStamp}${app_secret}`;
  console.log(plainText, "plainText");

  const signature = crypto.createHmac("sha256", app_secret).update(plainText).digest("hex");
  // const signature = CryptoJS.HmacSHA256(plainText, app_secret).toString();

  console.log(typeof signature, "type of signature");

  return {
    sign: signature,
    timestamp: timeStamp,
  };
  //* 202212
};

export const getShopCipher = async () => {
  console.log("Getting Shop Cipher!");

  const timeStamp = Math.floor(Date.now() / 1000);
  const path = "/authorization/202309/shops";
  const plainText = `${app_secret}${path}app_key${app_key}timestamp${timeStamp}${app_secret}`;

  const hmac = crypto.createHmac("sha256", app_secret);
  hmac.update(plainText);

  return {
    signCipher: hmac.digest("hex"),
    timestampCipher: timeStamp,
  };
};
