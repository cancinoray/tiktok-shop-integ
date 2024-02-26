import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const app_key = process.env.APP_KEY;
const access_token =
  "TTP_2w-7UQAAAAD9snMZVj-Wwd1tiQwF6BC09zqLlZwOWkW8CpLy9j59_sw-58FGyeTS0JsUf-wHrzXSrYOWSymNLqJvj0QHVhQd8BbdSeH6qZyUm8SpxVZAQMOZ_HnnDYgmkD5hG1goNHuQ3QJnmofv-YfZ1rfTqcLleINUsdtXIq2IDJJCpHeDjA";
const BASE_URL = "https://open-api.tiktokglobalshop.com";
const SHOP_CIPHER = "TTP_CTgI5gAAAAALMLVw3mlheTH9Yg6LW7Ji";

export async function getOrders(signature: any, timestamp: any, ctx: any) {
  console.log("GETTING ORDERS!");

  const requestData = {
    app_key,
    timestamp,
    sign: signature,
    shop_cipher: SHOP_CIPHER,
    page_size: 100,
    access_token,
  };

  const APIpath = "/api/orders/search";
  // const APIpath = "/order/202309/orders/search";

  console.log(requestData, "params");
  console.log(BASE_URL + APIpath, "url");

  try {
    const response = await axios.post(BASE_URL + APIpath, null, {
      params: requestData,
      headers: {
        "x-tts-access-token": access_token,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error: any) {
    console.error("Error:", error);
    console.error("Response Data:", error.response ? error.response.data : "No response data");
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

export async function getAuthShop(signature: any, timestamp: any, ctx: any) {
  console.log("GETTING ORDERS!");
  try {
    const response = axios.get(
      `
      ${BASE_URL}/authorization/202309/shops?app_key=${app_key}&sign=${signature}&timestamp=${timestamp}
    `,
      {
        headers: {
          "Content-Type": "application/json",
          "x-tts-access-token": access_token,
        },
      }
    );

    return response;
  } catch (error: any) {
    console.error("Error:", error);
    console.error("Response Data:", error.response ? error.response.data : "No response data");
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
